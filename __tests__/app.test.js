const app = require('../app.js');
const request = require('supertest')
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

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