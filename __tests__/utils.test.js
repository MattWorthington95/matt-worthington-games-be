const format = require("pg-format");
const { formatCatData } = require("../db/utils/data-manipulation")


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
        expect(formatCatData(input)).toEqual([['slug1', 'description1'], ['slug2', 'description2']])
    });
});

