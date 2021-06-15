const methods = require("./DAL");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.resolver = {
  Query: {
    login: async (_, { email, password }, context) => {
      try {
        const user = await methods.findUsername(email, context.db);

        if (user && user.length === 0) {
          throw new Error("Email does not exist");
        }
        const hash = user[0].password;
        if (!bcrypt.compareSync(password, hash)) {
          throw new Error("Wrong password!!!");
        }
        console.log(bcrypt.compareSync(password, hash));
        const num = Math.floor(100000 + Math.random() * 900000);

        const msg = {
          to: email, // Change to your recipient
          from: "amanzholkakim@gmail.com", // Change to your verified sender
          subject: "Login verification code",
          text: "Your verification code is",
          html: `<strong>${num}</strong>`,
        };

        await methods.sendMsg(msg, context.sgMail);
        const res = await methods.setValue(user[0].userid, num, context.client);
        return res;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    tfa: async (_, { value, email }, context) => {
      try {
        const user = await methods.findUsername(email, context.db);
        const result = await methods.getValue(user[0].userid, context.client);
        if (result != value) throw new Error("Your code is wrong or expired");
        const accesstoken = jwt.sign(
          { userid: user[0].userid },
          process.env.ACCESS_SECRET_TOKEN
        );

        return accesstoken;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    signup: async (_, { email, username, password }, context) => {
      try {
        if (!email) {
          throw new Error("Email is needed");
        }
        const res = await methods.findUsername(email, context.db);

        if (res && res.length > 0) {
          throw new Error("Email already exist");
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const obj = await methods.insertUser(email, username, hash, context.db);
        return obj;
      } catch (err) {
        throw err;
      }
    },
  },
};
