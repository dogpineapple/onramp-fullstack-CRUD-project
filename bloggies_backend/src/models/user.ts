const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User {

  /** Registers a user */
  static async register(username: string, password: string, displayName: string) {
    const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    try {
    const res = await db.query(
      `INSERT INTO users (username, display_name, hashed_pwd) 
          VALUES ($1, $2, $3)
          RETURNING username, display_name`,
      [username, displayName, hashedPwd]);
      const user = res.rows[0];

      // Generate a jwt token with payload of `username` and `user_id`.
      let token = jwt.sign({ username: user.username, user_id: user.id });
      return { user: user, token};
    } catch (err) { 
      throw new ExpressError("Username already exists", 400);
    }
  }

  /** Authenticate a user login */
  static async authenticate(username: string, password: string) {
    const res = await db.query(
      `SELECT hashed_pwd, id FROM users WHERE username = $1`,
      [username]);
    const user = res.rows[0];

    if (user) {
      // Check entered password is valid against hashed password.
      const isValid = await bcrypt.compare(password, user.hashed_pwd);
      if (isValid) {
        // Generate a jwt token with payload of `username` and `user_id`.
        let token = jwt.sign({ username: user.username, user_id: user.id });
        return { message: "Login successful", token };
      }
    }
    // Throw error if no user found or password is not valid.
    throw new ExpressError("Credentials are not valid", 400);
  }

  /** Get specific user from database */
  static async getUser(userId: number) {
    const res = await db.query(
      `SELECT user_id, username, display_name 
        FROM users 
        WHERE user_id = $1`, 
      [ userId ]);
    return res.rows[0];
  }
}