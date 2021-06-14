jest.mock("../graphql/users/DAL");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
const methods = require("../graphql/users/DAL");
const { resolver } = require("../graphql/users/resolver");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

test("login 1", async () => {
  methods.findUsername.mockImplementation(() => [
    { userid: 1, username: "MockAmanzhan", password: "MockPassword" },
  ]);
  bcrypt.compareSync = jest.fn().mockReturnValue(true);
  jwt.sign.mockResolvedValue("token");

  const result = await resolver.Query.login(
    undefined,
    { name: "amanzhan", password: "kaim" },
    {}
  );
  expect(result).toBe("token");
});
