jest.mock("../api/graphql/users/DAL");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
const methods = require("../graphql/users/DAL");
const { resolver } = require("../graphql/users/resolver");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
bcrypt.compareSync = jest.fn().mockReturnValue(true);

test("login 1", async () => {
  methods.findUsername.mockImplementation(() => [
    { userid: 1, username: "MockAmanzhan", password: "MockPassword" },
  ]);

  jwt.sign.mockResolvedValue("token");
  console.log(jwt.sign());

  const result = await resolver.Query.login(
    undefined,
    { name: "amanzhan", password: "kaim" },
    {}
  );
  expect(result).toBe("token");
});
