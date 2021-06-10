function sum(a, b) {
  return a + b;
}

test("", () => {
  expect(sum(2, 2)).toBe(4);
});
