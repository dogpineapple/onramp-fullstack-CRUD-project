import db from "../db";
import ExpressError from "../expressError";

export default class Post {

  /** Create a new post */
  static async createPost(title: string, description: string, body: string, userId: number) {
    try {
      const res = await db.query(
        `INSERT INTO posts ( title, description, body, author_id )
          VALUES ($1, $2, $3, $4) 
          RETURNING id, title, description, body, author_id, created_at, p.last_updated_at`,
        [title, description, body, userId]);
      return res.rows[0];
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Get all existing posts */
  static async getAllPosts() {
    try {
      const res = await db.query(
        `SELECT p.id, title, description, body, u.display_name AS author_name, u.photo_url AS author_photo, author_id, created_at, p.last_updated_at, COUNT(f.post_id) AS favorite_count
        FROM posts AS p
        JOIN users AS u 
        ON p.author_id = u.id
        LEFT OUTER JOIN favorites AS f
        ON p.id = f.post_id
        GROUP BY f.post_id, p.id, u.display_name, u.photo_url`);
      return res.rows;
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Get a specific post by id */
  static async getPost(id: number) {
    try {
      const res = await db.query(
        `SELECT p.id, p.title, p.description, p.body, u.display_name AS author_name, u.photo_url AS author_photo, p.author_id, p.created_at, p.last_updated_at, COUNT(f.post_id) AS favorite_count
        FROM posts AS p
        JOIN users AS u 
          ON p.author_id = u.id
        LEFT OUTER JOIN favorites AS f
          ON p.id = f.post_id
        GROUP BY f.post_id, p.id, u.display_name, u.photo_url, p.title, p.description, p.body, p.author_id, p.created_at, p.last_updated_at
          HAVING p.id = $1`,
        [id]);
      return res.rows[0];
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  static async getPostByUserId(id: number) {
    try {
      const res = await db.query(
        `SELECT p.id, p.title, p.description, u.display_name AS author_name, u.photo_url AS author_photo, p.body, p.author_id, p.created_at, p.last_updated_at,  COUNT(f.post_id) AS favorite_count
        FROM posts AS p
        JOIN users AS u
          ON p.author_id = u.id
        LEFT OUTER JOIN favorites AS f
          ON f.post_id = p.id
        GROUP BY f.post_id, p.id, p.title, p.description, u.display_name, u.photo_url, p.body, p.author_id, p.created_at, p.last_updated_at
          HAVING p.author_id = $1`,
        [id]);
      return res.rows;
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Check if post belongs to the current user */
  static async checkIsAuthor(postId: number, currentUserId: number) {
    const post = await this.getPost(postId);
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
        `UPDATE posts AS p
        SET ${query} p.last_updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1
        RETURNING p.last_updated_at`,
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
      `SELECT p.id, title, description, body, u.display_name AS author_name, u.photo_url as author_photo, author_id, created_at, p.last_updated_at, COUNT(f.post_id) AS favorite_count
      FROM posts AS p
      JOIN users AS u 
      ON p.author_id = u.id
      LEFT OUTER JOIN favorites AS f
      ON p.id = f.post_id
      GROUP BY f.post_id, p.id, u.display_name, u.photo_url
      HAVING LOWER(p.title) LIKE LOWER('%' || $1 || '%') 
        OR LOWER(p.description) LIKE LOWER('%' || $1 || '%')
        OR LOWER(u.display_name) LIKE LOWER('%' || $1 || '%')`,
      [term]);

    return res.rows;
  }
}