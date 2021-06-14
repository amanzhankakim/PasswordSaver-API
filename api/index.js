const mercurius = require("mercurius");
const pool = require("./db/pool");
const client = require("./db/redis");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.API_KEY);
const fastify = require("fastify")({
  logger: true,
});

const glue = require("schemaglue");

const { makeExecutableSchema } = require("graphql-tools");

const { schema, resolver } = glue("./graphql");

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver,
});

fastify.register(mercurius, {
  schema: executableSchema,
  graphiql: "playground",
  context: (request, reply) => {
    // Return an object that will be available in your GraphQL resolvers
    return {
      token: request.headers["x-jwtoken"],
      db: pool,
      client: client,
      sgMail: sgMail,
    };
  },
});

const start = async () => {
  try {
    await fastify.listen(3000, "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
