const methods = require("./DAL");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const redis = require("redis");

//const client = redis.createClient();

exports.resolver = {
  Query: {
    login: async (_, { name, password }, context) => {
      try {
        console.log(methods.findUsername("amanzhan", "kakim"));
        const user = await methods.findUsername(name, context.db);

        if (user && user.length === 0) {
          throw new Error("Username does not exist");
        }
        console.log(user);
        const hash = user[0].password;
        console.log(bcrypt.compareSync(password, hash));
        if (!bcrypt.compareSync(password, hash)) {
          throw new Error("Wrong password!!!");
        }
        const accesstoken = jwt.sign(user[0], process.env.ACCESS_SECRET_TOKEN);

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
