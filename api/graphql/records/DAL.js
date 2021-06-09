module.exports = {
  findRecordByName: async (name, id, db) => {
    const obj = await db.query(
      "SELECT * FROM records WHERE username = $1 AND recordid = $2",
      [name, id]
    );

    return obj.rows;
  },

  findAllRecords: async (id, db) => {
    const obj = await db.query("SELECT * FROM records WHERE recordid = $1", [
      id,
    ]);

    return obj.rows;
  },

  insertRecord: async (name, password, id, db) => {
    const obj = await db.query(
      "INSERT INTO records (username, password, recordid) values ($1, $2, $3) RETURNING *",
      [name, password, id]
    );

    return obj.rows;
  },

  deleteRecord: async (id, db) => {
    const obj = await db.query(
      "DELETE FROM records WHERE serialid = $1 RETURNING *",
      [id]
    );

    return obj.rows[0];
  },

  updateRecord: async (name, password, id, db) => {
    const obj = await db.query(
      "UPDATE records SET username = $1, password = $2 WHERE serialid = $3 RETURNING *",
      [name, password, id]
    );

    return obj.rows[0];
  },
};
