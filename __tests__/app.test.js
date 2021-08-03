const app = require('../app.js');
const request = require('supertest')
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');

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
});