const methods = require("./DAL");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.resolver = {
  Query: {
    login: async (_, { name, password }, context) => {
      try {
        const user = await methods.findUsername(name, context.db);

        if (user && user.rowCount === 0) {
          throw new Error("Username does not exist");
        }

        const hash = user.rows[0].password;
        if (!bcrypt.compareSync(password, hash)) {
          throw new Error("Wrong password!!!");
        }

        const accesstoken = jwt.sign(
          user.rows[0],
          process.env.ACCESS_SECRET_TOKEN
        );

        return accesstoken;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    signup: async (_, { username, password }, context) => {
      try {
        const res = await methods.findUsername(username, context.db);

        if (res && res.rowCount > 0) {
          throw new Error("Username already exist");
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const obj = await methods.insertUser(username, hash, context.db);
        return obj;
      } catch (err) {
        throw err;
      }
    },
  },
};
