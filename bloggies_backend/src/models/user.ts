import db from "../db";
import ExpressError from "../expressError";
import { ACTIVE, INACTIVE } from "../membershipStatuses";

export default class User {

  /** Create a new user */
  static async createUser(userId: number, displayName: string) {
    try {
      const res = await db.query(
        `INSERT INTO users (user_id, display_name)
        VALUES ($1, $2)
        RETURNING display_name, membership_status, membership_start_date, membership_end_date,
        last_submission_date`,
        [userId, displayName]);
      return res.rows[0];
    } catch (err) {
      throw new ExpressError('Display name is already taken.', 400)
    }
  }

  /** Get specific user from database */
  static async getUser(userId: number) {
    const res = await db.query(
      `SELECT user_id AS id, display_name, membership_status, membership_start_date, 
      membership_end_date, last_submission_date, subscription_id, customer_id
        FROM users
        WHERE user_id = $1`,
      [userId]);
    return res.rows[0];
  }

  static async getUserBySubscriptionId(subscriptionId: string) {
    const res = await db.query(
      `SELECT ua.email, u.membership_end_date
      FROM users as u
      JOIN user_auth as ua
      ON u.user_id = ua.id
      WHERE u.subscription_id = $1`,
      [subscriptionId]
    )
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
      `SELECT user_id AS id, display_name, last_submission_date
        FROM users
        WHERE LOWER(display_name) LIKE LOWER('%' || $1 || '%')`,
      [term]);
    return res.rows;
  }

  /** Return the membership status of a given user */
  static async checkMembershipStatus(userId: number) {
    const res = await db.query(
      `SELECT membership_status
      FROM users
      WHERE user_id = $1`,
      [userId]
    );
    return res.rows[0];
  }

  /** Update the membership status after the application is complete and front end sends the status.
   * If status has been changed to "active", update membership start date and end date */
  static async updateMembership(userId: number, appStatus: string, startDate?: number, endDate?: number) {
    const res = await db.query(
      `UPDATE users
        SET membership_status = $1, membership_start_date = $2, membership_end_date = $3
        WHERE user_id = $4
        RETURNING user_id, membership_status, membership_start_date, membership_end_date`,
        [appStatus, startDate || null, endDate || null, userId]);
    return res.rows[0];
  }

  /** Update an existing user */
  static async updateUser(id: number, updateData: any) {
    try {
      let query = "";

      for (let key in updateData) {
        query = query + ` ${key} = '${updateData[key]}', `;
      }

      //remove final comma
      query = query.slice(0, query.length - 2);

      await db.query(
        `UPDATE users
        SET ${query}  
        WHERE user_id = $1`,
        [id]);
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Sets membership_status to INACTIVE. Sets membership_end_date 
   * to CURRENT_TIMESTAMP. via subscription id */
  static async cancelSubscription(subscriptionId: string, end_date: Date) {
    try {
      const res = await db.query(
        `UPDATE users 
        SET membership_status = $2, membership_end_date = $3
        WHERE subscription_id = $1
        RETURNING user_id AS id, membership_status, membership_end_date`,
        [subscriptionId, INACTIVE, end_date]);

      const { id } = res.rows[0];

      console.log(id);
    } catch(err) {
      throw new ExpressError(err, 500);
    }
  }

  /** Sets membership_status to ACTIVE. Sets membership_start_date to CURRENT_TIMESTAMP. 
   * Sets membership_end_date to one month from CURRENT_TIMESTAMP. via subscription id */
   static async startSubscription(subscriptionId: string, startTime: Date, endTime: Date) {
   try {
    await db.query(
      `UPDATE users 
      SET membership_status = $2, membership_start_date = to_timestamp($3), membership_end_date = to_timestamp($4)
      WHERE subscription_id = $1`,
      [subscriptionId, ACTIVE, startTime, endTime]);
    } catch(err) {
        throw new ExpressError('Can\'t update the db', 500);
    }
  }

  //checks that the display_name given at registration doesn't already exist before adding it
  static async checkForUniqueDisplayName(display_name: string) {
      const res = await db.query(
        `SELECT display_name
        FROM users
        WHERE display_name = $1`,
        [display_name]
      );
    return res.rows[0];
  }

  static async checkExpiringMemberships() {
    const dueDate = new Date();
    const date = dueDate.getDate() + 3;
    dueDate.setDate(date);
    const res = await db.query(
      `SELECT ua.email, u.membership_end_date
      FROM users as u
      JOIN user_auth as ua
      ON u.user_id = ua.id
      WHERE u.membership_status = $1
      AND u.membership_end_date <= $2`,
      ['active', dueDate]
    )
    return res.rows;
  }
}