
class Post {

  /** Get specific user from database */
  static async create(title: string, description: string, body: string, userId: number) {
    const res = await db.query(
      `INSERT INTO posts ( title, description, body, author_id )
        VALUES ($1, $2, $3, $4)`, 
      [ userId ]);
    return res.rows[0];
  }
}