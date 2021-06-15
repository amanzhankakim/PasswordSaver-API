jest.mock("../graphql/users/DAL");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
const methods = require("../graphql/users/DAL");
const { resolver } = require("../graphql/users/resolver");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isDescribable } = require("@graphql-tools/utils");

describe("Login", () => {
  test("login 1", async () => {
    methods.findUsername.mockImplementation(() => [
      { userid: 1, username: "MockAmanzhan", password: "MockPassword" },
    ]);
    bcrypt.compareSync = jest.fn().mockReturnValue(true);
    jwt.sign.mockResolvedValue("token");

    methods.sendMsg.mockImplementation(() => true);
    methods.setValue.mockImplementation(() => true);
    const result = await resolver.Query.login(
      undefined,
      { name: "amanzhan", password: "kaim" },
      {}
    );
    expect(result).toBe(true);
  });

  test("login 2", async () => {
    methods.findUsername.mockImplementation(() => []);
    await expect(
      resolver.Query.login(
        undefined,
        { name: "amanzhan", password: "kaim" },
        {}
      )
    ).rejects.toThrow("Email does not exist");
  });

  test("login 3", async () => {});
});
