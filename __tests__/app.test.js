const app = require('../app.js');
const request = require('supertest')
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');
const reviews = require('../db/data/test-data/reviews.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/not-a-path', () => {
    test('404 - return a custom error msg', async () => {
        const { body: { message } } = await request(app)
            .get('/api/not-a-path').expect(404)
        expect(message).toBe('Path does not exist')
    });
});

describe('/api/categories', () => {
    describe('GET', () => {
        test('200: returns an array of categories', async () => {
            const { body: { categories } } = await request(app)
                .get("/api/categories")
                .expect(200)
            expect(Array.isArray(categories)).toBe(true)
            expect(categories).toHaveLength(4)
        });
        test('200: returns categories in the correct format', async () => {
            const { body: { categories } } = await request(app)
                .get("/api/categories")
                .expect(200)
            categories.forEach(categories => {
                expect(categories).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        });
    });
});

describe('/api/reviews/:review_id', () => {
    describe('GET', () => {
        test('200: returns a review based on if given', async () => {
            const { body: { review } } = await request(app)
                .get('/api/reviews/2')
                .expect(200)
            expect(typeof review).toBe("object")
            expect(Array.isArray(review)).toBe(false)
        });
        test('200: returns an review in correct format', async () => {
            const { body: { review } } = await request(app)
                .get('/api/reviews/2')
                .expect(200)
            expect(Object.entries(review)).toHaveLength(10)

            expect(review).toMatchObject({
                review_id: 2,
                title: 'Jenga',
                review_body: 'Leslie Scott',
                designer: 'philippaclaire9',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes: 5,
                category: 'dexterity',
                owner: 'philippaclaire9',
                created_at: '2021-01-18T00:00:00.000Z',
                comment_count: 3
            });
        });
        describe('Error Handling', () => {
            test('if passed an id that is not a num, send back custom message', async () => {
                const { body: { message } } = await request(app)
                    .get('/api/reviews/incorrect-id')
                    .expect(400)
                expect(message).toBe('Invalid Review Id')
            });
            test('if passed an id that doesnt exist, send back custom message', async () => {
                const { body: { message } } = await request(app)
                    .get('/api/reviews/10000')
                    .expect(400)
                expect(message).toBe('Review not found')
            });
        });
    });
    describe('PATCH', () => {
        test('201: return an updated review working with positive num', async () => {
            const { body: { updatedReview } } = await request(app)
                .patch('/api/reviews/2')
                .send({ inc_votes: 1 })
                .expect(201)
            expect(updatedReview).toEqual({
                review_id: 2,
                title: 'Jenga',
                review_body: 'Leslie Scott',
                designer: 'philippaclaire9',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes: 6,
                category: 'dexterity',
                owner: 'philippaclaire9',
                created_at: '2021-01-18T00:00:00.000Z'
            })
        });
        test('201: return an updated review working with negative num', async () => {
            const { body: { updatedReview } } = await request(app)
                .patch('/api/reviews/2')
                .send({ inc_votes: -1 })
                .expect(201)
            expect(updatedReview.votes).toEqual(4)
        });
        describe('Error Handling', () => {
            test('if passed an id that doesnt exist, send back custom message', async () => {
                const { body: { message } } = await request(app)
                    .patch('/api/reviews/2000')
                    .send({ inc_votes: 1 })
                    .expect(400)
                expect(message).toBe('Review not found')
            });
            test('if passed inc_votes incorrectly, return a custom message', async () => {
                const { body: { message } } = await request(app)
                    .patch('/api/reviews/1')
                    .send({ incorrectKey: 1 })
                    .expect(400)
                expect(message).toBe('Incorrect key passed for Patched')
            });
            test('if passed incorrect value, return a custom message', async () => {
                const { body: { message } } = await request(app)
                    .patch('/api/reviews/1')
                    .send({ inc_votes: "hello" })
                    .expect(400)
                expect(message).toBe('inc_votes need to be a number')
            });
        });
    });
});

describe('/api/reviews', () => {
    describe('GET', () => {
        test('200: should return all reviews as an array', async () => {
            const { body: { reviews } } = await request(app)
                .get("/api/reviews")
                .expect(200)
            expect(Array.isArray(reviews)).toBe(true)
        });
        test('200: should return all reviews', async () => {
            const { body: { reviews } } = await request(app)
                .get("/api/reviews")
                .expect(200)
            expect(Array.isArray(reviews)).toBe(true)
            reviews.forEach(review => {
                expect(review).toMatchObject(expect.objectContaining({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    comment_count: expect.any(String)
                }))
            });
        });
        test('200: if passed valid sort query, sort by it', async () => {
            const { body: { reviews } } = await request(app)
                .get("/api/reviews?sort_by=votes")
                .expect(200)
            expect(reviews[0].votes).toBe(100)
            expect(reviews[reviews.length - 1].votes).toBe(1)
        });
        test('200: if passed valid sort query, sort by it', async () => {
            const { body: { reviews } } = await request(app)
                .get("/api/reviews?sort_by=comment_count")
                .expect(200)
            expect(reviews[0].comment_count).toBe("3")
            expect(reviews[reviews.length - 1].comment_count).toBe("0")
        });
        test('200: if passed a order query, toggle ASC and DESC in return', async () => {
            const { body: { reviews } } = await request(app)
                .get("/api/reviews?sort_by=comment_count&order=asc")
                .expect(200)
            expect(reviews[0].comment_count).toBe("0")
            expect(reviews[reviews.length - 1].comment_count).toBe("3")
        });
        // test('200: will filter categories', () => {
        //     const { body: { reviews } } = await request(app)
        //         .get("/api/reviews?category=jenga")
        //         .expect(200)
        // });
    });
})
