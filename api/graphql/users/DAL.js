module.exports = {
  findUsername: async (email, db) => {
    try {
      const res = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return res.rows;
    } catch (err) {
      throw err;
    }
  },

  insertUser: async (email, username, hash, db) => {
    try {
      const obj = await db.query(
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
        [email, username, hash]
      );
      return obj.rows[0];
    } catch (err) {
      throw err;
    }
  },
};
