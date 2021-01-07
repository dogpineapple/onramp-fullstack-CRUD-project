import db from "../db";
import ExpressError from "../expressError";

export default class Favorite {

  /** Retrieve all tasks for a user by user_id */
  static async getAll(userId: number) {
    try {
      const res = await db.query(
        `SELECT p.id, p.title, p.description, p.body, p.author_id
          FROM favorites as f
          JOIN posts as p ON f.post_id = p.id 
          WHERE f.user_id = $1`,
        [userId]);
      const favoritedPosts = res.rows;
      return favoritedPosts;
    } catch (err) {
      console.log(`err: ${err}`)
      throw new ExpressError("Invalid user id", 400);
    }
  }

  /** Adds a favorited post for a user */
  static async add(userId: number, postId: number) {
    try {
      await db.query(
        `INSERT INTO favorites (user_id, post_id)
          VALUES ($1, $2)`,
        [userId, postId]);
      return { message: "Favorited successfully." };
    } catch (err) {
      console.log(`err: ${err}`)
      throw new ExpressError("Invalid user_id/post_id", 400);
    }
  }

  /** Adds a favorited post for a user */
  static async delete(userId: number, postId: number) {
    try {
      await db.query(
        `DELETE FROM favorites
           WHERE user_id = $1 AND post_id = $2`,
        [userId, postId]);
      return { message: "Unfavorited successfully." };
    } catch (err) {
      throw new ExpressError("Invalid user_id/post_id", 400);
    }
  }

}