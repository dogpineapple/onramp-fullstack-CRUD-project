import db from "../db";
import Comment from "../models/comment";

const VALID_AUTHOR_ID = 1;
const VALID_POST_ID = 1;

/** Tests for Comment model */
describe("Test comment class", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM comments");
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE comments_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");

    await db.query(
      `INSERT INTO users (username, display_name, hashed_pwd)
        VALUES ('posttest', 'post', 'password')`);

    await db.query(
      `INSERT INTO posts (title, description, body, author_id) 
        VALUES
            ('Strawberry Basil Soda', 
            'Made with Strawberry, Basil, Sparkling Water', 
            'Body text description goes here', 
            1)`);

    await db.query(
      `INSERT INTO comments (body, post_id, author_id, is_reply) 
        VALUES ('This is a really great post about strawberry soda', 1, 1, false)`);
  });

  // test("can create a new comment", async function () {
  //   const post = await Comment.createComment("Test comment", VALID_POST_ID, VALID_AUTHOR_ID, false);

  //   const foundPostRes = await db.query(`SELECT body, author_id FROM comments WHERE post_id = 1`);
  //   const foundPost = foundPostRes.rows[1];

  //   expect(post.body).toBe("Test comment");
  //   expect(post.created_at).toBeDefined();
  //   expect(foundPost.body).toBe("Test comment");
  //   expect(foundPost.author_id).toBe(VALID_AUTHOR_ID);
  // });

  test("can get comments by post id", async function () {
    const res = await Comment.getCommentsByPostId(VALID_POST_ID);
    expect(res.comments.length).toEqual(VALID_POST_ID);
    expect(res.comments[0].body).toEqual("This is a really great post about strawberry soda");
  });

  test("can handle invalid post_id when creating new comment", async function () {
    try {
      await Comment.createComment("Test unhappy comment post", 100, VALID_AUTHOR_ID, false);
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