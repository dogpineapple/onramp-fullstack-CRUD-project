import db from "../db";
import ExpressError from "../expressError";

export default class Post {

  /** Create a new post */
  static async create(title: string, description: string, body: string, userId: number) {
    try { 
      const res = await db.query(
        `INSERT INTO posts ( title, description, body, author_id )
          VALUES ($1, $2, $3, $4) 
          RETURNING id, title, description, body, author_id, created_at, last_updated_at`, 
        [ title, description, body, userId ]);
      return res.rows[0];
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Get all existing posts */
  static async getAll() {
    try { 
      const res = await db.query(
        `SELECT id, title, description, body, author_id, created_at, last_updated_at
        FROM posts`);
      return res.rows;
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Get all existing posts */
  static async getPost(id: number) {
    try { 
      const res = await db.query(
        `SELECT id, title, description, body, author_id, created_at, last_updated_at
        FROM posts
        WHERE id = $1`,
        [ id ]);
      return res.rows[0];
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Check if post belongs to the current user */
  static async isAuthor(postId: number, currentUserId: number) {
    const post = await this.getPost(postId);
    return post.author_id === currentUserId;
  }

  /** Update an existing posts */
  static async update(id: number, updateData: any) {
    try { 
      let query = "";
      
      for (let key in updateData ) {
        query = query + ` ${key} = '${updateData[key]}', `;
      }
      
      await db.query(
        `UPDATE posts
        SET ${query} last_updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1`,
        [ id ]);
      
      return { message: "Successfully updated." };
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  static async delete(id: number) {
    await db.query(
      `DELETE FROM posts
      WHERE id = $1`,
      [ id ]);
    return { message: "Successfully deleted." };
  }

  /** Searches based on term given - term can be a string or post date */
  static async search(term: any) {
    // if term is a string.. search posts by title
    // if term is a date.. search posts by created_at dates
  }
}