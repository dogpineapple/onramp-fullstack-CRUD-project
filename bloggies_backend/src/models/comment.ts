import db from "../db";
import ExpressError from "../expressError";

export default class Comment {
  /** Retrieve all comment for a post by post_id */
  static async getCommentsByPostId(postId: number) {
    try {
      /** LEFT OUTER JOIN to retrieve replies of comments && comments WITHOUT comments */
      const res = await db.query(
        `SELECT c.id, c.body, c.author_id, u.display_name as author_name, c.created_at, c.is_reply, COUNT(r.reply_to_comment_id) as reply_count, c.post_id
          FROM comments as c
          JOIN posts as p 
            ON c.post_id = p.id
          JOIN users as u 
            ON c.author_id = u.id
          LEFT OUTER JOIN replies as r 
            ON c.id = r.reply_to_comment_id
          GROUP BY r.reply_to_comment_id, c.id, c.body, c.author_id, c.created_at, u.display_name, c.post_id, c.is_reply
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
        `SELECT c.id, c.body, c.author_id, c.created_at, u.display_name as author_name, c.post_id, c.is_reply
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

  static async createComment(body: string, postId: number, authorId: number, isReply: boolean) {
    try {
      const res = await db.query(
        `INSERT INTO comments (body, post_id, author_id, is_reply)
          VALUES ($1, $2, $3, $4)
          RETURNING created_at, id`,
        [body, postId, authorId, isReply]);
      return res.rows[0];
    } catch (err) {
      console.log(`error in create comment: ${err}`);
      throw new ExpressError("Invalid author_id/post_id", 400);
    }
  }

  static async createReply(commentId: number, replyToCommentId: number) {
    try {
      await db.query(
        `INSERT INTO replies (comment_id, reply_to_comment_id)
          VALUES ($1, $2)`,
        [commentId, replyToCommentId]);
    } catch (err) {
      console.log(`error in create comment: ${err}`);
      throw new ExpressError("Invalid comment_id(s)", 400);
    }
  }
}