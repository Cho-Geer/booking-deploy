import { sum } from "../sum";

describe("sum()", () => {
    it("should add 1 and 2 returning 3", () => {
        expect(sum(1, 2)).toBe(3);
    });
});

describe("sum()", () => {
    it("should not be greater than 3", () => {
        expect(sum(1, 2)).not.toBeGreaterThan(3);
    })
})

describe("sum()", () => {
    it("should not be 4", () => {
        expect(sum(2, 3)).not.toBe(3);
    });
});

test("should not be 5", () => {
    expect(sum(1, 2)).not.toBe(5);
});

expect.extend({
    toBeWithinRange(received, floor, celling) {
        const pass = received >= floor && received <= celling;
        if (pass) {
            return {
                message: `${received} not to be within range ${floor} - ${celling}`,
                pass: true
            };
        } else {
            return {
                message: `${received} to be within range ${floor} - ${celling}`,
                pass: false
            };
        }
    }
});

test("numeric ranges", () => {
    expect(100).toBeWithinRange(90, 110);
    expect(101).not.toBeWithinRange(0, 100);
    expect({ apples: 6, bananas: 3 }).toEqual({
        apples: expect.toBeWithinRange(1, 10),
        bananas: expect.not.toBeWithinRange(11, 20)
    });
});