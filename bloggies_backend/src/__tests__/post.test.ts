
describe("Test post class", function () {
  beforeAll(async function() {
    // create a user
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.query(
      `INSERT INTO users (username, display_name, hashed_pwd)
      VALUES ('Test', 'Laliho', 'password');`);
  });

  beforeEach(async function() {
    await db.query("DELETE FROM posts");
    await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await db.query(
      `INSERT INTO posts(title, description, body, author_id) 
      VALUES
          ('Strawberry Basil Soda', 
          'Made with Strawberry, Basil, Sparkling Water', 
          'Body text description goes here', 
          1)`);
  });

  test("can create new post", async function() {
    const post = await Post.create("Test title", "Test description", "Test body", 1);
    expect(post.title).toBe("Test title");
    expect(post.body).toBe("Test body");
    expect(post.author_id).toBe(1);
  });

  test("can get post", async function() {
    const post = await Post.getPost(1);
    expect(post.title).toBe("Strawberry Basil Soda");
    expect(post.description).toBe("Made with Strawberry, Basil, Sparkling Water");
    expect(post.author_id).toBe(1);
  });

  test("can update a post", async function () {
    const updateData = { title: "Lemon Soda", description: "Lemon with Sparkling Water"}
    const res = await Post.update(1, updateData);

    const results = await db.query(
      `SELECT title, description
      FROM posts
      WHERE id = 1`);

    const post = results.rows[0];

    expect(res.message).toBe("Successfully updated.");
    expect(post.title).toBe(updateData.title);
    expect(post.description).toBe(updateData.description);
  });

  test("can delete post", async function() {
    await Post.delete(1);
    const res = await db.query(
      `SELECT id, title, description, body, author_id, created_at, last_updated_at
      FROM posts
      WHERE id = 1`);
    expect(res.rows.length).toBe(0);
  });

  test("can identify current user as not the author of a post", async function() {
    const author = await Post.isAuthor(1, 2);
    expect(author).toBe(false);
  });

  test("can identify current user as the author of a post", async function() {
    const author = await Post.isAuthor(1, 1);
    expect(author).toBe(true);
  });
})