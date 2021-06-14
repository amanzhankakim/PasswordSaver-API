const methods = require("./DAL");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const redis = require("redis");
const sgMail = require("@sendgrid/mail");

const client = redis.createClient({
  host: "redis",
  port: 6379,
});

sgMail.setApiKey(
  "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"
);

client.on("error", function (err) {
  console.log("Error " + err);
});
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

        const num = Math.floor(100000 + Math.random() * 900000);

        const msg = {
          to: "amanzhan.kakim@nu.edu.kz", // Change to your recipient
          from: "amanzhankakim13@gmail.com", // Change to your verified sender
          subject: "Login verification code",
          text: "Your verification code is",
          html: `<strong>${num}</strong>`,
        };

        sgMail
          .send(msg)
          .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
          })
          .catch((error) => {
            console.error(error);
          });
        client.set(user[0].userid, num, "EX", 3600, () => {});
        return user[0].userid;
      } catch (err) {
        throw err;
      }
    },

    tfa: (_, { value, user_id }, context) => {
      return client.get(user_id, (err, result) => {
        if (result != value) throw new Error("Wrong code");
        const accesstoken = jwt.sign(
          { userid: user_id },
          process.env.ACCESS_SECRET_TOKEN
        );

        return accesstoken;
      });
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
