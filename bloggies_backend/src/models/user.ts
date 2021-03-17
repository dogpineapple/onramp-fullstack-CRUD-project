import db from "../db";
import ExpressError from "../expressError";

export default class User {

  /** Create a new user */
  static async createUser(userId: number, displayName: string) {
    try {
      await db.query(
        `INSERT INTO users (user_id, display_name, membership_active)
        VALUES ($1, $2, $3)`,
        [userId, displayName, false]);
    } catch (err) {
      throw new ExpressError('Display name is already taken.', 400)
    }
  }

  /** Get specific user from database */
  static async getUser(userId: number) {
    const res = await db.query(
      `SELECT user_id AS id, display_name, membership_eligibility, membership_active, membership_start_date, membership_end_date, last_submission_date
        FROM users
        WHERE user_id = $1`,
      [userId]);
    return res.rows[0];
  }

  /** Get the last_submission_date for specific user from database */
  static async getLastSubmissionDate(userId: number) {
    const res = await db.query(
      `SELECT last_submission_date
        FROM users
        WHERE user_id = $1`,
      [userId]);
    return res.rows[0].last_submission_date;
  }

  static async searchUsers(term: string) {
    const res = await db.query(
      `SELECT user_id AS id, display_name, membership_active, last_submission_date
        FROM users
        WHERE LOWER(display_name) LIKE LOWER('%' || $1 || '%')`,
      [term]);
    return res.rows;
  }
}