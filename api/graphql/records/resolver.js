const jwt = require("jsonwebtoken");
const methods = require("./DAL");

exports.resolver = {
  Query: {
    findRecords: async (_, { name }, context) => {
      try {
        const user = jwt.verify(context.token, process.env.ACCESS_SECRET_TOKEN);

        if (!user.userid) {
          throw new Error("The are no userid");
        }

        console.log(user);
        const rows = await methods.findRecordByName(
          name,
          user.userid,
          context.db
        );

        if (rows.length === 0) {
          throw new Error("Record does not exist");
        }
        return rows;
      } catch (err) {
        throw err;
      }
    },

    getAllRecords: async (_, args, context) => {
      try {
        const user = jwt.verify(context.token, process.env.ACCESS_SECRET_TOKEN);

        if (!user.userid) {
          throw new Error("The are no userid");
        }

        const rows = await methods.findAllRecords(user.userid, context.db);

        if (rows.length === 0) {
          throw new Error("There are no record");
        }
        return rows;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    addRecord: async (_, { name, password }, context) => {
      try {
        const user = jwt.verify(context.token, process.env.ACCESS_SECRET_TOKEN);

        if (!user.userid) {
          throw new Error("The are no userid");
        }
        const rows = await methods.insertRecord(
          name,
          password,
          user.userid,
          context.db
        );
        return rows[0];
      } catch (err) {
        throw err;
      }
    },

    deleteRecord: async (_, { id }, context) => {
      try {
        jwt.verify(context.token, process.env.ACCESS_SECRET_TOKEN);
        const result = await methods.deleteRecord(id, context.db);

        return result;
      } catch (err) {
        throw err;
      }
    },

    updateRecord: async (_, { id, name, password }, context) => {
      try {
        jwt.verify(context.token, process.env.ACCESS_SECRET_TOKEN);

        const result = await methods.updateRecord(
          id,
          name,
          password,
          context.db
        );

        return result;
      } catch (err) {
        throw err;
      }
    },
  },
};
