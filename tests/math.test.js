const { calculateTip } = require("../src/math");

test("Should calculate total with tip", () => {
    const total = calculateTip(10, 0.3);

    expect(total).toBe(13)
});

test('async test demo', (done) => {
    setTimeout(() => {
        expect(2).toBe(2)
        done()
    }, 2000)
})