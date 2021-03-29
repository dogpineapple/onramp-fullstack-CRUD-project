import db from "../db";
import ExpressError from "../expressError";
import { ACTIVE } from "../membershipStatuses";

export default class Post {

  /** Create a new post */
  static async createPost(title: string, description: string, body: string, userId: number, isPremium: boolean) {
    try {
      const res = await db.query(
        `INSERT INTO posts ( title, description, body, author_id, is_premium )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, title, description, body, author_id, is_premium, created_at, last_updated_at`,
        [title, description, body, userId, isPremium]);
      return res.rows[0];
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Get all existing posts for active users and only non-premium posts for all other users */
  static async getAllPosts(status: string) {
    try {
      if(status === ACTIVE) {
        const res = await db.query(
          `SELECT p.id, title, description, body, p.is_premium, u.display_name AS author_name, author_id, created_at, p.last_updated_at, COUNT(b.post_id) AS bookmark_count
          FROM posts AS p
          JOIN users AS u
          ON p.author_id = u.user_id
          LEFT OUTER JOIN bookmarks AS b
          ON p.id = b.post_id
          GROUP BY b.post_id, p.id, u.display_name`);
        return res.rows;
      }
      const res = await db.query(
        `SELECT p.id, title, description, body, p.is_premium, u.display_name AS author_name, author_id, created_at, p.last_updated_at, COUNT(b.post_id) AS bookmark_count
          FROM posts AS p
          JOIN users AS u
          ON p.author_id = u.user_id
          LEFT OUTER JOIN bookmarks AS b
          ON p.id = b.post_id
          WHERE is_premium = $1
          GROUP BY b.post_id, p.id, u.display_name`,
          [false]);
        return res.rows;
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Get a specific post by id */
  static async getPost(id: number, membershipStatus: string) {
    try {
      const res = await db.query(
        `SELECT p.id, p.title, p.description, p.body, p.is_premium, u.display_name AS author_name, p.author_id, p.created_at, p.last_updated_at, COUNT(b.post_id) AS bookmark_count
        FROM posts AS p
        JOIN users AS u
          ON p.author_id = u.user_id
        LEFT OUTER JOIN bookmarks AS b
          ON p.id = b.post_id
        GROUP BY b.post_id, p.id, u.display_name, p.title, p.description, p.body,  p.is_premium, p.author_id, p.created_at, p.last_updated_at
          HAVING p.id = $1`,
        [id]);

      //only active members can access premium posts
      const resRow = res.rows[0];
      if(!resRow) return undefined;
      if(membershipStatus === 'active' && resRow.is_premium) return res.rows[0];
      if(!resRow.is_premium) return res.rows[0];
      throw new ExpressError('You do not have access to this post!', 403);

    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  static async getPostByUserId(id: number) {
    try {
      const res = await db.query(
        `SELECT p.id, p.title, p.description, p.is_premium, u.display_name AS author_name, p.body, p.is_premium, p.author_id, p.created_at, p.last_updated_at, COUNT(b.post_id) AS bookmark_count
        FROM posts AS p
        JOIN users AS u
          ON p.author_id = u.user_id
        LEFT OUTER JOIN bookmarks AS b
          ON b.post_id = p.id
        GROUP BY b.post_id, p.id, p.title, p.description, u.display_name, p.body, p.author_id, p.created_at, p.last_updated_at, p.is_premium
          HAVING p.author_id = $1`,
        [id]);
      return res.rows;
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Check if post belongs to the current user */
  static async checkIsAuthor(postId: number, currentUserId: number) {
    //automatically allow users to see their own posts, even if they are not currently active
    const post = await this.getPost(postId, ACTIVE);
    return post.author_id === currentUserId;
  }

  /** Update an existing post */
  static async updatePost(id: number, updateData: any) {
    try {
      let query = "";

      for (let key in updateData) {
        query = query + ` ${key} = '${updateData[key]}', `;
      }

      const res = await db.query(
        `UPDATE posts
        SET ${query} last_updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING last_updated_at`,
        [id]);
      const updatedPost = res.rows[0];
      return { last_updated_at: updatedPost.last_updated_at };
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  static async deletePost(id: number) {
    await db.query(
      `DELETE FROM posts
      WHERE id = $1`,
      [id]);
    return { message: "Successfully deleted." };
  }

  /** Searches based on term given - term can be a string or post date */
  static async searchPosts(term: string) {
    // if term is a date.. search posts by created_at dates
    const res = await db.query(
      `SELECT p.id, p.title, p.description, p.body, u.display_name AS author_name, author_id, p.is_premium, created_at, p.last_updated_at, COUNT(b.post_id) AS bookmark_count
      FROM posts AS p
      JOIN users AS u
      ON p.author_id = u.user_id
      LEFT OUTER JOIN bookmarks AS b
      ON p.id = b.post_id
      GROUP BY b.post_id, p.id, u.display_name
      HAVING LOWER(p.title) LIKE LOWER('%' || $1 || '%')
        OR LOWER(p.description) LIKE LOWER('%' || $1 || '%')
        OR LOWER(u.display_name) LIKE LOWER('%' || $1 || '%')`,
      [term]);
    return res.rows;
  }
}