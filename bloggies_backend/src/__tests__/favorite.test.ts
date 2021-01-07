import db from "../db";
import Favorite from "../models/favorite";

/** Tests for Favorite model methods*/
describe("Test favorite class model", function () {
  beforeAll(async () => {
    await db.query("DELETE FROM favorites");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM posts");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.query(
      `INSERT INTO users (username, display_name, hashed_pwd)
      VALUES ('Test', 'Laliho', 'password')`);
    await db.query(
      `INSERT INTO posts(title, description, body, author_id) 
        VALUES
            ('Strawberry Basil Soda', 
            'Made with Strawberry, Basil, Sparkling Water', 
            'Body text description goes here', 
            1)`);
  });


  test("can add a favorite", async () => {
    const userId = 1;
    const postId = 1;
    const res = await Favorite.add(userId, postId);
    expect(res.message).toBe("Favorited successfully.");
    const expectedRes = await db.query(
      `SELECT p.title, u.display_name 
        FROM favorites AS f 
        JOIN posts AS p ON p.id = f.post_id 
        JOIN users AS u ON u.id = f.user_id
        WHERE p.id = $1 AND u.id = $2`,
      [postId, userId]);

    const favorite = expectedRes.rows[0];
    expect(favorite.title).toBe("Strawberry Basil Soda");
    expect(favorite.display_name).toBe("Laliho");
  });

  test("can remove a favorite", async () => {
    const userId = 1;
    const postId = 1;
    const res = await Favorite.delete(userId, postId);
    expect(res.message).toBe("Unfavorited successfully.");
    const expectedRes = await db.query(
      `SELECT p.id
        FROM favorites AS f 
        JOIN posts AS p ON p.id = f.post_id 
        JOIN users AS u ON u.id = f.user_id
        WHERE p.id = $1 AND u.id = $2`,
      [postId, userId]);

    const favorites = expectedRes.rows;
    expect(favorites.length).toBe(0);
  });

  test("can getAll favorites", async () => {
    const userId = 1;
    const postId = 1;
    const secondPostId = 2;
  
    await db.query(
      `INSERT INTO posts(title, description, body, author_id) 
      VALUES
      ('Blueberry banana smoothie', 
      'Made with Blueberry, Banana, and ice', 
      'Smoothies are cool!', 
      1)`);
      
    await db.query(
      `INSERT INTO favorites (user_id, post_id)
        VALUES $1, $2`,
      [userId, postId]);
    await db.query(
      `INSERT INTO favorites (user_id, post_id)
        VALUES $1, $2`,
      [userId, secondPostId]);

    const favorites = await Favorite.getAll(userId);
    expect(favorites.length).toBe(2);
  });
});