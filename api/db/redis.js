const redis = require("redis");
const util = require("util");
const client = redis.createClient({
  host: "redis",
  port: 6379,
});

client.set = util.promisify(client.set).bind(client);
client.get = util.promisify(client.get).bind(client);

module.exports = client;
