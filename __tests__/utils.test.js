const format = require("pg-format");
const { formatCatData, formatUserData, formatReviewData, titleToMatchID, formatCommentData } = require("../db/utils/data-manipulation")


describe('formatCatData', () => {
    test('if passed an empty array, return empty array', () => {
        expect(formatCatData([])).toEqual([])
    });
    test('when passed correct data, returns an array of arrays', () => {
        const input = [
            { slug: "slug1", description: "description1" }
        ]
        expect(Array.isArray(formatCatData(input))).toBe(true)
        formatCatData(input).forEach(index => {
            expect(Array.isArray(index)).toBe(true)
        })
    });
    test('should not manipulate data passed in', () => {
        const input = [
            { slug: "slug1", description: "description1" },
            { slug: "slug2", description: "description2" }
        ]
        formatCatData(input)
        expect(input).toEqual([
            { slug: "slug1", description: "description1" },
            { slug: "slug2", description: "description2" }
        ])
        expect(input[0]).toEqual({ slug: "slug1", description: "description1" })
        expect(input[1]).toEqual({ slug: "slug2", description: "description2" })
    });
    test('returns an array of nested arrays with the correct data inside', () => {
        const input = [
            { slug: "slug1", description: "description1" },
            { slug: "slug2", description: "description2" }
        ]
        expect(formatCatData(input)).toEqual([
            ['slug1', 'description1'], ['slug2', 'description2']
        ])
    });
});

describe('formatUserData', () => {
    test('if passed an empty array, return empty array', () => {
        expect(formatUserData([])).toEqual([])
    });
    test('when passed correct data, returns an array of arrays', () => {
        const input = [
            { username: "username1", avatar_url: "url1", name: "name1" }
        ]
        expect(Array.isArray(formatUserData(input))).toBe(true)
        formatUserData(input).forEach(index => {
            expect(Array.isArray(index)).toBe(true)
        })
    });
    test('should not manipulate data passed in', () => {
        const input = [
            { username: "username1", avatar_url: "url1", name: "name1" },
            { username: "username2", avatar_url: "url2", name: "name2" }
        ]
        formatUserData(input)
        expect(input).toEqual([
            { username: "username1", avatar_url: "url1", name: "name1" },
            { username: "username2", avatar_url: "url2", name: "name2" }
        ])
        expect(input[0]).toEqual({ username: "username1", avatar_url: "url1", name: "name1" })
        expect(input[1]).toEqual({ username: "username2", avatar_url: "url2", name: "name2" })
    });
    test('returns an array of nested arrays with the correct data inside', () => {
        const input = [
            { username: "username1", avatar_url: "url1", name: "name1" },
            { username: "username2", avatar_url: "url2", name: "name2" }
        ]
        expect(formatUserData(input)).toEqual([
            ['username1', 'url1', 'name1'], ['username2', 'url2', 'name2']
        ])
    });
});

describe('formatReviewsData', () => {
    test('if passed an empty array, return empty array', () => {
        expect(formatReviewData([])).toEqual([])
    });
    test('when passed correct data, returns an array of arrays', () => {
        const input = [
            {
                title: 'Title1',
                designer: 'Designer1',
                owner: 'onwer1',
                review_img_url:
                    'url1',
                review_body: 'body1',
                category: 'cat1',
                created_at: new Date(1610964020514),
                votes: 1
            }
        ]
        expect(Array.isArray(formatReviewData(input))).toBe(true)
        formatReviewData(input).forEach(index => {
            expect(Array.isArray(index)).toBe(true)
        })
    });
    test('should not manipulate data passed in', () => {
        const input = [
            {
                title: 'Title1',
                designer: 'Designer1',
                owner: 'onwer1',
                review_img_url:
                    'url1',
                review_body: 'body1',
                category: 'cat1',
                created_at: new Date(1610964020514),
                votes: 1
            }
        ]
        formatReviewData(input)
        expect(input).toEqual([
            {
                title: 'Title1',
                designer: 'Designer1',
                owner: 'onwer1',
                review_img_url:
                    'url1',
                review_body: 'body1',
                category: 'cat1',
                created_at: new Date(1610964020514),
                votes: 1
            }
        ])
        expect(input[0]).toEqual({
            title: 'Title1',
            designer: 'Designer1',
            owner: 'onwer1',
            review_img_url:
                'url1',
            review_body: 'body1',
            category: 'cat1',
            created_at: new Date(1610964020514),
            votes: 1
        })
    });
    test('returns an array of nested arrays with the correct data inside', () => {
        const input = [
            {
                title: 'Title1',
                designer: 'Designer1',
                owner: 'onwer1',
                review_img_url:
                    'url1',
                review_body: 'body1',
                category: 'cat1',
                created_at: new Date(1610964020514),
                votes: 1
            }
        ]
        expect(formatReviewData(input)).toEqual(
            [
                [
                    'Title1',
                    'Designer1',
                    'onwer1',
                    'url1',
                    1,
                    'cat1',
                    'onwer1',
                    new Date(1610964020514)
                ]
            ])
    });
});

describe('titleToMatchID', () => {
    test('does not manipulate the data being passed in', () => {
        const reviewData = [
            {
                review_id: 1,
                title: 'Title1',
                designer: 'Designer1',
                owner: 'onwer1',
                review_img_url:
                    'url1',
                review_body: 'body1',
                category: 'cat1',
                created_at: new Date(1610964020514),
                votes: 1
            }
        ]
        titleToMatchID(reviewData)
        expect(reviewData).toEqual([
            {
                review_id: 1,
                title: 'Title1',
                designer: 'Designer1',
                owner: 'onwer1',
                review_img_url:
                    'url1',
                review_body: 'body1',
                category: 'cat1',
                created_at: new Date(1610964020514),
                votes: 1
            }
        ])
    });
    test('returns an object with matched title and id', () => {
        const reviewData = [
            {
                review_id: 1,
                title: 'Title1',
                designer: 'Designer1',
                owner: 'onwer1',
                review_img_url:
                    'url1',
                review_body: 'body1',
                category: 'cat1',
                created_at: new Date(1610964020514),
                votes: 1
            }
        ]
        expect(titleToMatchID(reviewData)).toEqual({ Title1: 1 })
    });
});

describe('formatCommentData', () => {
    test('if passed an empty array, return empty array', () => {
        expect(formatCommentData([])).toEqual([])
    });
    test('when passed correct data, returns an array of arrays', () => {
        const input1 = [{
            body: "'I loved this game too!'",
            belongs_to: 'Jenga',
            created_by: 'bainesface',
            votes: 16,
            created_at: new Date(1511354613389)
        }]
        const input2 = {
            Jenga: 2
        }
        expect(Array.isArray(formatCommentData(input1, input2))).toBe(true)
        formatCommentData(input1, input2).forEach(index => {
            expect(Array.isArray(index)).toBe(true)
        })
    });
    test('should not manipulate data passed in', () => {
        const input1 = [{
            body: "'I loved this game too!'",
            belongs_to: 'Jenga',
            created_by: 'bainesface',
            votes: 16,
            created_at: new Date(1511354613389)
        }]
        const input2 = {
            Jenga: 2
        }
        formatCommentData(input1, input2)
        expect(input1).toEqual([{
            body: "'I loved this game too!'",
            belongs_to: 'Jenga',
            created_by: 'bainesface',
            votes: 16,
            created_at: new Date(1511354613389)
        }])
        expect(input2).toEqual({
            Jenga: 2
        })
    });
    test('returns an array of nested arrays with the correct data inside', () => {
        const input1 = [{
            body: "'I loved this game too!'",
            belongs_to: 'Jenga',
            created_by: 'bainesface',
            votes: 16,
            created_at: new Date(1511354613389)
        }]
        const input2 = {
            Jenga: 2
        }
        console.log(formatCommentData(input1, input2));
        expect(formatCommentData(input1, input2)).toEqual([
            [
                'bainesface',
                2,
                16,
                new Date(1511354613389),
                "'I loved this game too!'"
            ]
        ]

        );

    });
})
