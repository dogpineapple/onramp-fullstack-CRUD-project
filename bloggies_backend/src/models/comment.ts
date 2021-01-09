import db from "../db";
import ExpressError from "../expressError";

export default class Comment {
  /** Retrieve all comment for a post by post_id */
  static async getCommentsByPostId(postId: number) {
    try {
      const res = await db.query(
        `SELECT c.id, c.body, c.author_id, u.display_name as author_name, c.created_at, COUNT(r.reply_to_comment_id) as reply_count, c.post_id
          FROM comments as c
          JOIN posts as p ON c.post_id = p.id
          JOIN users as u ON c.author_id = u.id
          JOIN replies as r ON c.id = r.reply_to_comment_id
          GROUP BY r.reply_to_comment_id, c.id, c.body, c.author_id, c.created_at, u.display_name, c.post_id
          HAVING c.post_id = $1`,
        [postId]);
      const comments = res.rows;
      return { comments };
    } catch (err) {
      console.log(`error in getcommentsbypostid: ${err}`);
      throw new ExpressError("Invalid post id", 400);
    }
  }

  static async getRepliesByCommentId(commentId: number) {
    try {
      const res = await db.query(
        `SELECT c.id, c.body, c.author_id, c.created_at, u.display_name as author_name, c.post_id
          FROM replies as r
          JOIN comments as c ON r.comment_id = c.id
          JOIN users as u ON u.id = c.author_id
          WHERE r.reply_to_comment_id = $1`,
        [commentId]);
      const replies = res.rows;
      return { replies };
    } catch (err) {
      console.log(`error in getrepliesbycommentid: ${err}`);
      throw new ExpressError("Invalid comment id", 400);
    }
  }
}