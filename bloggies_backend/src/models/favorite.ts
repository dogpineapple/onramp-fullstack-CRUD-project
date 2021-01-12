import db from "../db";
import ExpressError from "../expressError";

export default class Favorite {

  /** Retrieve all favorites for a user by user_id */
  static async getAll(userId: number) {
    const res = await db.query(
      `SELECT p.id, p.title, p.description, p.body, p.author_id, p.created_at, u.display_name AS author_name, COUNT(f.post_id) AS favorite_count
          FROM favorites AS f
          JOIN posts AS p ON f.post_id = p.id
          JOIN users AS u ON p.author_id = u.id
          GROUP BY f.post_id, p.id, p.title, p.description, p.body, p.author_id, f.user_id, u.display_name, p.created_at
          HAVING f.user_id = $1`,
      [userId]);
    const favoritedPosts = res.rows;
    return favoritedPosts;
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
    await db.query(
      `DELETE FROM favorites
           WHERE user_id = $1 AND post_id = $2`,
      [userId, postId]);
    return { message: "Unfavorited successfully." };
  }
}