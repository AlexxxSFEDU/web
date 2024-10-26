const bcrypt = require('bcrypt');

class User {
   constructor(id, username, password, createdAt) {
      this.id = id;
      this.username = username;
      this.password = password;
      this.createdAt = createdAt;
   }

   static async findByUsername(username, pool) {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) {
         return null;
      }
      return new User(
         result.rows[0].id,
         result.rows[0].username,
         result.rows[0].password,
         result.rows[0].created_at
      );
   }

   static async findById(id, pool) {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) {
         return null;
      }
      return new User(
         result.rows[0].id,
         result.rows[0].username,
         result.rows[0].password,
         result.rows[0].created_at
      );
   }

   verifyPassword(password) {
      return bcrypt.compareSync(password, this.password);
   }
}

module.exports = User;