import db from "../db";
import Favorite from "../models/favorite";

let validPostId: number;
let validUserId: number;

/** Tests for Favorite model methods*/
describe("Test favorite class model", function () {
  
  beforeEach(async () => {
    await db.query("DELETE FROM favorites");
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    const userRes = await db.query(
      `INSERT INTO users (username, display_name, hashed_pwd)
      VALUES ('favoritetest', 'Laliho', 'password')
      RETURNING id`);
    validUserId = userRes.rows[0].id;
    
    const postRes = await db.query(
      `INSERT INTO posts(title, description, body, author_id) 
        VALUES
            ('Strawberry Basil Soda', 
            'Made with Strawberry, Basil, Sparkling Water', 
            'Body text description goes here', 
            ${validUserId})
        RETURNING id`);

    validPostId = postRes.rows[0].id;
  });

  test("can add a favorite", async () => {
    const res = await Favorite.createFavorite(validUserId, validPostId);
    expect(res.message).toBe("Favorited successfully.");

    const expectedRes = await db.query(
      `SELECT p.title, u.display_name 
        FROM favorites AS f 
        JOIN posts AS p ON p.id = f.post_id 
        JOIN users AS u ON u.id = f.user_id
        WHERE p.id = $1 AND u.id = $2`,
      [validPostId, validUserId]);

    const favorite = expectedRes.rows[0];
    expect(favorite.title).toBe("Strawberry Basil Soda");
    expect(favorite.display_name).toBe("Laliho");
  });

  test("can handle invalid user_id when adding a favorite", async () => {
    try { 
       await Favorite.createFavorite(9999, validPostId);
    } catch (err) {
      expect(err.message).toBe("Invalid user_id/post_id");
    }
  });

  test("can remove a favorite", async () => {
    const res = await Favorite.deleteFavorite(validUserId, validPostId);
    expect(res.message).toBe("Unfavorited successfully.");
    const expectedRes = await db.query(
      `SELECT p.id
        FROM favorites AS f 
        JOIN posts AS p ON p.id = f.post_id 
        JOIN users AS u ON u.id = f.user_id
        WHERE p.id = $1 AND u.id = $2`,
      [validPostId, validUserId]);

    const favorites = expectedRes.rows;
    expect(favorites.length).toBe(0);
  });

  test("can getAll favorites", async () => {
    let secondPostId: number;

    const secondPost = await db.query(
      `INSERT INTO posts(title, description, body, author_id) 
      VALUES
      ('Blueberry banana smoothie', 
      'Made with Blueberry, Banana, and ice', 
      'Smoothies are cool!', 
      1)
      RETURNING id`);

    secondPostId = secondPost.rows[0].id;

    await db.query(
      `INSERT INTO favorites (user_id, post_id)
        VALUES ($1, $2)`,
      [validUserId, validPostId]);
    await db.query(
      `INSERT INTO favorites (user_id, post_id)
        VALUES ($1, $2)`,
      [validUserId, secondPostId]);

    const favorites = await Favorite.getAllFavorites(validUserId);
    expect(favorites.length).toBe(2);
  });

  afterAll(async () => {
    await db.query("DELETE FROM favorites");
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.end();
  });
});