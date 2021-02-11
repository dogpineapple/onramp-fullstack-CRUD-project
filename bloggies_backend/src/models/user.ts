import db from "../db";
import ExpressError from "../expressError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BCRYPT_WORK_FACTOR, SECRET_KEY } from "../config";

export default class User {

  /** Registers a user */
  static async register(username: string, password: string, displayName: string) {
    const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    try {
      const res = await db.query(
        `INSERT INTO users (username, display_name, hashed_pwd) 
          VALUES ($1, $2, $3)
          RETURNING id, username, display_name, join_date, photo_url`,
        [username, displayName, hashedPwd]);
      const user = res.rows[0];
      // Generate a jwt token with payload of `username` and `user_id`.
      let token = jwt.sign({ username: user.username, user_id: user.id }, SECRET_KEY);
      return { user: user, token };
    } catch (err) {
      throw new ExpressError("Username already exists", 400);
    }
  }

  /** Authenticate a user login */
  static async authenticate(username: string, password: string) {
    const res = await db.query(
      `SELECT hashed_pwd, id, join_date, display_name, photo_url FROM users WHERE username = $1`,
      [username]);
    const user = res.rows[0];
    if (user) {
      // Check entered password is valid against hashed password.
      const isValid = await bcrypt.compare(password, user.hashed_pwd);
      if (isValid) {
        // Generate a jwt token with payload of `username` and `user_id`.
        let token = jwt.sign({ username: username, user_id: user.id }, SECRET_KEY);
        return { user: { id: user.id, username: username, join_date: user.join_date, display_name: user.display_name, photo_url: user.photo_url}, token };
      }
      // Throw error if password is not valid.
      throw new ExpressError("Credentials do not match, please try again", 400);
    }
    // Throw error if no user found.
    throw new ExpressError("User does not exist, please try again", 400);
  }

  /** Get specific user from database */
  static async getUser(userId: number) {
    const res = await db.query(
      `SELECT id, username, display_name, join_date, photo_url
        FROM users 
        WHERE id = $1`,
      [userId]);
    return res.rows[0];
  }

  /** Update profile photo for a specific user from database */
  static async updatePhoto(userId: number, photoUrl: string) {
    try {
      console.log("photoUrl", photoUrl);
      await db.query(
        `UPDATE users
          SET photo_url = $2
          WHERE id = $1`,
        [userId, photoUrl]);
      return "success";
    } catch (err) {
      console.log(err);
      throw new ExpressError(`Error occurred when updating profile photo: ${err}`, 400);
    }
  }


  static async searchUsers(term: string) {
    const res = await db.query(
      `SELECT id, username, display_name, join_date, photo_url
        FROM users 
        WHERE LOWER(display_name) LIKE LOWER('%' || $1 || '%')`,
      [term]);
    return res.rows;
  }
}