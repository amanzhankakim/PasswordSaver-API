module.exports = {
  findUsername: async (username, db) => {
    try {
      const res = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      console.log(res);
      return res.rows;
    } catch (err) {
      throw err;
    }
  },

  insertUser: async (username, hash, db) => {
    try {
      const obj = await db.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
        [username, hash]
      );
      return obj.rows[0];
    } catch (err) {
      throw err;
    }
  },
};
