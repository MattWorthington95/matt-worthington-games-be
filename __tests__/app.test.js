const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const reviews = require("../db/data/test-data/reviews.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/not-a-path", () => {
  test("404 - return a custom error msg", async () => {
    const {
      body: { message },
    } = await request(app).get("/api/not-a-path").expect(404);
    expect(message).toBe("Path does not exist");
  });
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("200: returns an array of categories", async () => {
      const {
        body: { categories },
      } = await request(app).get("/api/categories").expect(200);
      expect(Array.isArray(categories)).toBe(true);
      expect(categories).toHaveLength(4);
    });
    test("200: returns categories in the correct format", async () => {
      const {
        body: { categories },
      } = await request(app).get("/api/categories").expect(200);
      categories.forEach((categories) => {
        expect(categories).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    test("200: returns a review based on if given", async () => {
      const {
        body: { review },
      } = await request(app).get("/api/reviews/2").expect(200);
      expect(typeof review).toBe("object");
      expect(Array.isArray(review)).toBe(false);
    });
    test("200: returns an review in correct format", async () => {
      const {
        body: { review },
      } = await request(app).get("/api/reviews/2").expect(200);
      expect(Object.entries(review)).toHaveLength(10);

      expect(review).toMatchObject({
        review_id: 2,
        title: "Jenga",
        review_body: "Fiddly fun for all the family",
        designer: "Leslie Scott",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        votes: 5,
        category: "dexterity",
        owner: "philippaclaire9",

        comment_count: 3,
      });
    });
    describe("Error Handling", () => {
      test("if passed an id that is not a num, send back custom message", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/reviews/incorrect-id").expect(400);
        expect(message).toBe("Invalid Review Id");
      });
      test("if passed an id that doesnt exist, send back custom message", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/reviews/10000").expect(404);
        expect(message).toBe("Review not found");
      });
    });
  });
  describe("PATCH", () => {
    test("201: return an updated review working with positive num", async () => {
      const {
        body: { updatedReview },
      } = await request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: 1 })
        .expect(201);
      expect(updatedReview).toEqual({
        review_id: 2,
        title: "Jenga",
        review_body: "Fiddly fun for all the family",
        designer: "Leslie Scott",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        votes: 6,
        category: "dexterity",
        owner: "philippaclaire9",
        created_at: expect.any(String),
      });
    });
    test("201: return an updated review working with negative num", async () => {
      const {
        body: { updatedReview },
      } = await request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: -1 })
        .expect(201);
      expect(updatedReview.votes).toEqual(4);
    });
    describe("Error Handling", () => {
      test("if passed an id that doesnt exist, send back custom message", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/reviews/2000")
          .send({ inc_votes: 1 })
          .expect(404);
        expect(message).toBe("Review not found");
      });
      test("if passed inc_votes incorrectly, return a custom message", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/reviews/1")
          .send({ incorrectKey: 1 })
          .expect(404);
        expect(message).toBe("Incorrect key passed for Patched");
      });
      test("if passed incorrect value, return a custom message", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: "hello" })
          .expect(400);
        expect(message).toBe("inc_votes need to be a number");
      });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET", () => {
    test("200: should return all reviews as an array", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews").expect(200);
      expect(Array.isArray(reviews)).toBe(true);
    });
    test("200: should return all reviews", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews").expect(200);
      expect(Array.isArray(reviews)).toBe(true);
      reviews.forEach((review) => {
        expect(review).toMatchObject(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            comment_count: expect.any(String),
          })
        );
      });
    });
    test("200: if passed valid sort query, sort by it", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews?sort_by=votes").expect(200);
      expect(reviews[0].votes).toBe(100);
    });
    test("200: if passed valid sort query, sort by it", async () => {
      const {
        body: { reviews },
      } = await request(app)
        .get("/api/reviews?sort_by=comment_count")
        .expect(200);
      expect(reviews[0].comment_count).toBe("3");
      expect(reviews[reviews.length - 1].comment_count).toBe("0");
    });
    test("200: if passed a order query, toggle ASC and DESC in return", async () => {
      const {
        body: { reviews },
      } = await request(app)
        .get("/api/reviews?sort_by=comment_count&order=asc")
        .expect(200);
      expect(reviews[0].comment_count).toBe("0");
    });
    test("200: will filter categories", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews?category=eurogame").expect(200);
      expect(reviews.length).not.toBe(0);
      expect(
        reviews.every((review) => {
          return review.category === "euro game";
        })
      ).toBe(true);
    });
    test("return an empty array is no reviews in category ", async () => {
      const {
        body: { reviews },
      } = await request(app)
        .get("/api/reviews?category=childrensgame")
        .expect(200);
    });
    test("200: return 5 reviews as a default limit", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews").expect(200);
      expect(reviews).toHaveLength(5);
    });
    test("200: returns num of reviews as limit added by user ", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews?limit=10").expect(200);
      expect(reviews).toHaveLength(10);
    });
    test("200: returns correct review when page specified", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews?page=3").expect(200);
      expect(reviews[0].review_id).toBe(3);
    });
    test("should ", () => {});
    describe("Error Handling", () => {
      test("should return custom message if invalid sort_by", async () => {
        const {
          body: { message },
        } = await request(app)
          .get("/api/reviews?sort_by=invalid_sort_by")
          .expect(400);
        expect(message).toBe("Invalid 'sort by' term. It does not exist");
      });
      test("should return custom message if invalid order", async () => {
        const {
          body: { message },
        } = await request(app)
          .get("/api/reviews?order=invalid_order")
          .expect(400);
        expect(message).toBe("Invalid order declared");
      });
      test("should return custom message if invalid category given", async () => {
        const {
          body: { message },
        } = await request(app)
          .get("/api/reviews?category=invalid_category")
          .expect(400);
        expect(message).toBe("Invalid category declared");
      });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    test("200: returns an array of comments", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/reviews/2/comments").expect(200);
      expect(Array.isArray(comments)).toBe(true);
    });
    test("200: returns an array of comments in correct format", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/reviews/2/comments").expect(200);

      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String),
        });
      });
    });
    test("200: returns an empty array if review has no comments", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/reviews/1/comments").expect(200);
      expect(Array.isArray(comments)).toBe(true);
    });
    describe("Error Handling", () => {
      test("if passed an id that is not a num, send back custom message", async () => {
        const {
          body: { message },
        } = await request(app)
          .get("/api/reviews/invalid_id/comments")
          .expect(400);
        expect(message).toBe("Invalid Review Id");
      });
      test("if passed an id that doesnt exist, send back custom message", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/reviews/20000/comments").expect(404);
        expect(message).toBe("Review not found");
      });
    });
  });
  describe("POST", () => {
    test("201: return the comment posted", async () => {
      const {
        body: { addedComment },
      } = await request(app)
        .post("/api/reviews/2/comments")
        .send({
          username: "mallionaire",
          body: "NEW COMMENT! <3",
        })
        .expect(201);
      expect(addedComment).toMatchObject({
        comment_id: 7,
        author: "mallionaire",
        votes: 0,
        body: "NEW COMMENT! <3",
      });
    });
    test("comments table is actually updated with comment", async () => {
      const {
        body: { addedComment },
      } = await request(app)
        .post("/api/reviews/2/comments")
        .send({
          username: "mallionaire",
          body: "NEW COMMENT! <3",
        })
        .expect(201);
      const { rows: testCommentsDB } = await db.query(`SELECT * from comments`);
      expect(testCommentsDB).toHaveLength(7);
      expect(testCommentsDB[testCommentsDB.length - 1]).toMatchObject({
        comment_id: 7,
        author: "mallionaire",
        votes: 0,
        body: "NEW COMMENT! <3",
      });
    });
    test("comments table is actually updated with comment", async () => {
      const {
        body: { addedComment },
      } = await request(app)
        .post("/api/reviews/2/comments")
        .send({
          username: "mallionaire",
          body: "NEW COMMENT! <3",
          votes: 7,
        })
        .expect(201);
      const { rows: testCommentsDB } = await db.query(`SELECT * from comments`);
      expect(testCommentsDB).toHaveLength(7);
      expect(testCommentsDB[testCommentsDB.length - 1]).toMatchObject({
        comment_id: 7,
        author: "mallionaire",
        votes: 0,
        body: "NEW COMMENT! <3",
      });
    });
    describe("Error Handling", () => {
      test("if passed wrong keys, return custom err message", async () => {
        const {
          body: { message },
        } = await request(app)
          .post("/api/reviews/2/comments")
          .send({
            invalid_username: "mallionaire",
            body: "NEW COMMENT! <3",
          })
          .expect(400);
        expect(message).toBe("Invalid username key or value");
      });
      test("if passed wrong keys, return custom err message", async () => {
        const {
          body: { message },
        } = await request(app)
          .post("/api/reviews/2/comments")
          .send({
            username: "mallionaire",
            invalid_body: "NEW COMMENT! <3",
          })
          .expect(400);
        expect(message).toBe("Invalid body key or value");
      });
      test("if passed an id that is not a num, send back custom message", async () => {
        const {
          body: { message },
        } = await request(app)
          .post("/api/reviews/invalid_id/comments")
          .expect(400);
        expect(message).toBe("Invalid Review Id");
      });
      test("if passed an id that doesnt exist, send back custom message", async () => {
        const {
          body: { message },
        } = await request(app)
          .post("/api/reviews/20000/comments")
          .send({
            username: "mallionaire",
            body: "NEW COMMENT! <3",
          })
          .expect(404);
        expect(message).toBe("Review not found");
      });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    test("200: returns object will all endpoints", async () => {
      const { body: endPoints } = await request(app).get("/api").expect(200);
      expect(endPoints).toMatchObject({
        "GET /api": {
          description:
            "serves up a json representation of all the available endpoints of the api",
        },
        "GET /api/categories": {
          description: "serves an array of all categories",
          queries: [],
          exampleResponse: expect.any(Object),
        },
        "GET /api/reviews": {
          description:
            "serves an array of all reviews with default pagination set to a limit of 5",
          queries: ["category", "sort_by", "order", "page", "limit"],
          exampleResponse: expect.any(Object),
        },
      });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204 ", async () => {
      await request(app).delete("/api/comments/3").expect(204);
      const { rows: comment } = await db.query(
        `SELECT * from comments WHERE comment_id = 3`
      );
      expect(comment).toEqual([]);
    });
  });
  describe("Error Handling", () => {
    test("return custom message if invalid id", async () => {
      const {
        body: { message },
      } = await request(app).delete("/api/comments/invalid_id").expect(400);
      expect(message).toEqual("Invalid Comment Id");
    });
    test("return custom message if no comment id found", async () => {
      const {
        body: { message },
      } = await request(app).delete("/api/comments/9999").expect(404);
      expect(message).toEqual("Comment Id Not Found");
    });
  });
  describe("PATCH", () => {
    test("201: return patched comment", async () => {
      const {
        body: { updatedComment },
      } = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(201);

      expect(updatedComment.votes).toEqual(17);
    });
    describe("Error Handling", () => {
      test("400: return custom message is passed wrong key", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/comments/1")
          .send({ incorrect_key: 1 })
          .expect(400);
        expect(message).toBe("Incorrect key, cannot patch");
      });
      test("400: return custom message is passed wrong value", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "hello" })
          .expect(400);
        expect(message).toBe("inc_votes must be a number");
      });
      test("404 if passed a comment id that isnt a number return custom message", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/comments/hello")
          .send({ inc_votes: 1 })
          .expect(404);
        expect(message).toBe("Invalid Comment ID");
      });
      test("400 if comment id doesnt exist", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/comments/9999")
          .send({ inc_votes: 1 })
          .expect(400);
        expect(message).toBe("Comment ID not found");
      });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: returns an array of users in correct format", async () => {
      const {
        body: { users },
      } = await request(app).get("/api/users").expect(200);
      expect(Array.isArray(users)).toBe(true);
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
        });
      });
    });
    describe("Error Handling", () => {
      test("404", () => {});
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("200: returns to correct user when passed username", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/mallionaire").expect(200);
      expect(user).toMatchObject({
        username: "mallionaire",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        name: "haz",
      });
    });
    describe("Error Handling", () => {
      test("If passed username doesnt exist, return a custom message", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/users/newusername2021").expect(404);
        expect(message).toEqual("Username doesnt exist");
      });
    });
  });
});
