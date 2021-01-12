import db from "../db";
import Comment from "../models/comment";

let validUserId: number;
let validPostId: number;
let validCommentId: number;

/** Tests for Comment model */
describe("Test comment class", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM comments");
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE comments_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");

    const userRes = await db.query(
      `INSERT INTO users (username, display_name, hashed_pwd)
        VALUES ('posttest', 'post', 'password')
        RETURNING id`);
    validUserId = userRes.rows[0];

    const postRes = await db.query(
      `INSERT INTO posts (title, description, body, author_id) 
        VALUES
            ('Strawberry Basil Soda', 
            'Made with Strawberry, Basil, Sparkling Water', 
            'Body text description goes here', 
            1)
        RETURNING id`);
    validPostId = postRes.rows[0];

    const commentRes = await db.query(
      `INSERT INTO comments (body, post_id, author_id, is_reply) 
        VALUES ('This is a really great post about strawberry soda', 1, 1, false)
        RETURNING id`);
    validCommentId = commentRes.rows[0];
  });

  test("can create a new comment", async function () {
    const post = await Comment.createComment("Test comment", validPostId, validUserId, false);

    const foundPostRes = await db.query(`SELECT body, author_id FROM comments WHERE post_id = 1`);
    const foundPost = foundPostRes.rows[1];

    expect(post.body).toBe("Test comment");
    expect(post.created_at).toBeDefined();
    expect(foundPost.body).toBe("Test comment");
    expect(foundPost.author_id).toBe(validUserId);
  });

  test("can get comments by post id", async function () {
    const res = await Comment.getCommentsByPostId(validPostId);
    expect(res.comments.length).toEqual(validPostId);
    expect(res.comments[0].body).toEqual("This is a really great post about strawberry soda");
  });

  test("can handle invalid post_id when creating new comment", async function () {
    try {
      await Comment.createComment("Test unhappy comment post", 100, validUserId, false);
    } catch (err) {
      expect(err.message).toBe("Invalid author_id/post_id");
      expect(err.status).toBe(400);
    }
  });
  
  afterAll(async () => {
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM comments");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE comments_id_seq RESTART WITH 1");
    await db.end();
  });
});