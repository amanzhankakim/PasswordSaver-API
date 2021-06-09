const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "db",
  database: "api_db",
});

createTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS `users` (userid SERIAL PRIMARY KEY, username varchar(255), password varchar(255))"
  );
};
module.exports = pool;
