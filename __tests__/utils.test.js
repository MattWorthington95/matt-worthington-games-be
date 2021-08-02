const format = require("pg-format");
const { formatCatData, formatUserData } = require("../db/utils/data-manipulation")


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

