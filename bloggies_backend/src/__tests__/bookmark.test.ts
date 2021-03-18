import db from "../db";
import Bookmark from "../models/bookmark";

let validPostId: number;
let validUserId: number;

const validUserEmail = 'bookmarks@test.com';
const validUserDisplayName = 'bookmarksuser';
const validPostDescription = 'Made with Strawberry, Basil, Sparkling Water';
const validPostTitle = 'Strawberry Basil Soda';

/** Tests for bookmark model methods*/
describe("Test Bookmark class model", function () {

  beforeEach(async () => {
    await db.query("DELETE FROM bookmarks");
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM user_auth");
    await db.query("ALTER SEQUENCE user_auth_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    const userAuthRes = await db.query(
      `INSERT INTO user_auth (email, hashed_pwd)
        VALUES ($1, $2)
        RETURNING id`,
      [validUserEmail, "password"]);

    validUserId = userAuthRes.rows[0].id;
    await db.query(
      `INSERT INTO users (user_id, display_name, membership_active)
      VALUES ($1, $2, false)`,
      [validUserId, validUserDisplayName]);


    const postRes = await db.query(
      `INSERT INTO posts(title, description, body, author_id, is_premium) 
        VALUES
            ($1, $2, 'Body text description goes here', $3, false)
        RETURNING id`,
      [validPostTitle, validPostDescription, validUserId]);

    validPostId = postRes.rows[0].id;
  });

  test("can add a bookmark", async () => {
    const res = await Bookmark.createBookmark(validUserId, validPostId);
    expect(res.message).toBe("Bookmarked successfully.");

    const expectedRes = await db.query(
      `SELECT p.title, u.display_name 
        FROM bookmarks AS b 
        JOIN posts AS p ON p.id = b.post_id 
        JOIN users AS u ON u.user_id = b.user_id
        WHERE p.id = $1 AND u.user_id = $2`,
      [validPostId, validUserId]);

    const bookmark = expectedRes.rows[0];
    expect(bookmark.title).toBe(validPostTitle);
    expect(bookmark.display_name).toBe(validUserDisplayName);
  });

  test("can handle invalid user_id when adding a bookmark", async () => {
    try {
      await Bookmark.createBookmark(9999, validPostId);
    } catch (err) {
      expect(err.message).toBe("Invalid user_id/post_id");
    }
  });

  test("can remove a bookmark", async () => {
    const res = await Bookmark.deleteBookmark(validUserId, validPostId);
    expect(res.message).toBe("Unbookmarked successfully.");
    const expectedRes = await db.query(
      `SELECT p.id
        FROM bookmarks AS b 
        JOIN posts AS p ON p.id = b.post_id 
        JOIN users AS u ON u.user_id = b.user_id
        WHERE p.id = $1 AND u.user_id = $2`,
      [validPostId, validUserId]);

    const bookmarks = expectedRes.rows;
    expect(bookmarks.length).toBe(0);
  });

  test("can getAll bookmarks", async () => {
    let secondPostId: number;

    const secondPost = await db.query(
      `INSERT INTO posts(title, description, body, author_id, is_premium) 
        VALUES
          ('Blueberry banana smoothie', 
          'Made with Blueberry, Banana, and ice', 
          'Smoothies are cool!', 
          1,
          false)
        RETURNING id`);

    secondPostId = secondPost.rows[0].id;

    await db.query(
      `INSERT INTO bookmarks (user_id, post_id)
        VALUES ($1, $2)`,
      [validUserId, validPostId]);
    await db.query(
      `INSERT INTO bookmarks (user_id, post_id)
        VALUES ($1, $2)`,
      [validUserId, secondPostId]);

    const bookmarks = await Bookmark.getAllBookmarks(validUserId);
    expect(bookmarks.length).toBe(2);
  });

  afterAll(async () => {
    await db.query("DELETE FROM bookmarks");
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM user_auth");
    await db.query("ALTER SEQUENCE users_auth_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.end();
  });
});