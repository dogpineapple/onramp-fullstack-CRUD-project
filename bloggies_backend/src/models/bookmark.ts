import db from "../db";
import ExpressError from "../expressError";

export default class Bookmark {

  /** Retrieve all bookmarks for a user by user_id */
  static async getAllBookmarks(userId: number) {
    const res = await db.query(
      `SELECT p.id, p.title, p.description, p.body, p.author_id, p.created_at, u.display_name AS author_name, COUNT(b.post_id) AS bookmark_count
        FROM bookmarks AS b
        JOIN posts AS p ON b.post_id = p.id
        JOIN users AS u ON p.author_id = u.user_id
        GROUP BY b.post_id, p.id, p.title, p.description, p.body, p.author_id, b.user_id, u.display_name, p.created_at
        HAVING b.user_id = $1`,
      [userId]
    )
    const bookmarkedPosts = res.rows;
    return bookmarkedPosts;
  }

  /** Adds a bookmarked post for a user */
  static async createBookmark(userId: number, postId: number) {
    try {
      await db.query(
        `INSERT INTO bookmarks (user_id, post_id)
          VALUES ($1, $2)`,
        [userId, postId]);
      return { message: "Bookmarked successfully." };
    } catch (err) {
      throw new ExpressError("Invalid user_id/post_id", 400);
    }
  }

  /** Adds a bookmarked post for a user */
  static async deleteBookmark(userId: number, postId: number) {
    await db.query(
      `DELETE FROM bookmarks
           WHERE user_id = $1 AND post_id = $2`,
      [userId, postId]);
    return { message: "Unbookmarked successfully." };
  }
}