class Movie {
   constructor(id, title, userId) {
      this.id = id;
      this.title = title;
      this.userId = userId;
   }

   static async getAllByUserId(userId, pool) {
      const result = await pool.query('SELECT * FROM movies WHERE "userId" = $1', [userId]);
      return result.rows.map(row => new Movie(row.id, row.title, row.userId));
   }

   static async create(title, userId, pool) {
      const result = await pool.query('INSERT INTO movies (title, "userId") VALUES ($1, $2) RETURNING *', [title, userId]);
      return new Movie(result.rows[0].id, result.rows[0].title, result.rows[0].userId);
   }

   static async update(id, title, pool) {
      const result = await pool.query('UPDATE movies SET title = $1 WHERE id = $2 RETURNING *', [title, id]);
      return new Movie(result.rows[0].id, result.rows[0].title, result.rows[0].userId);
   }

   static async delete(id, pool) {
      await pool.query('DELETE FROM movies WHERE id = $1', [id]);
   }
}

module.exports = Movie;
