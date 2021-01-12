import db from "../db";
import Post from "../models/post";

let validPostId: number;
let validUserId: number;

/** Tests for Post model */
describe("Test post class", function () {
  beforeEach(async function () {
    // create a user
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    const userRes = await db.query(
      `INSERT INTO users (username, display_name, hashed_pwd)
      VALUES ('posttest', 'post', 'password')
      RETURNING id`);
    validUserId = userRes.rows[0].id;

    const postRes = await db.query(
      `INSERT INTO posts(title, description, body, author_id) 
        VALUES
            ('Strawberry Basil Soda', 
            'Made with Strawberry, Basil, Sparkling Water', 
            'Body text description goes here', 
            1)
        RETURNING id`);
    validPostId = postRes.rows[0].id;
  });

  test("can create new post", async function () {
    const post = await Post.create("Test title", "Test description", "Test body", validUserId);
    expect(post.title).toBe("Test title");
    expect(post.body).toBe("Test body");
    expect(post.author_id).toBe(validUserId);
  });

  test("can get post by post id", async function () {
    const post = await Post.getPost(validPostId);
    expect(post.title).toBe("Strawberry Basil Soda");
    expect(post.description).toBe("Made with Strawberry, Basil, Sparkling Water");
    expect(post.author_id).toBe(validUserId);
  });

  test("can update a post", async function () {
    const updateData = { title: "Lemon Soda", description: "Lemon with Sparkling Water" }
    const res = await Post.update(validPostId, updateData);

    const results = await db.query(
      `SELECT title, description
      FROM posts
      WHERE id = ${validPostId}`);

    const post = results.rows[0];

    expect(res.last_updated_at).toBeDefined();
    expect(post.title).toBe(updateData.title);
    expect(post.description).toBe(updateData.description);
  });

  test("can delete post", async function () {
    await Post.delete(validPostId);
    const res = await db.query(
      `SELECT id, title, description, body, author_id, created_at, last_updated_at
      FROM posts
      WHERE id = ${validPostId}`);
    expect(res.rows.length).toBe(0);
  });

  test("can identify current user as not the author of a post", async function () {
    const author = await Post.isAuthor(validUserId, 99);
    expect(author).toBe(false);
  });

  test("can identify current user as the author of a post", async function () {
    const author = await Post.isAuthor(validUserId, validUserId);
    expect(author).toBe(true);
  });

  afterAll(async () => {
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.end();
  });
});