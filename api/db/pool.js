const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "db",
  database: "api_db",
});

module.exports = pool;
