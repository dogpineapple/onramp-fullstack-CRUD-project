import request from "supertest";
import app from "../app";
import db from "../db";
import User from "../models/user";

let token: string;
let validUserId: number;
let validPostId: number;

describe("Test Post routes", function () {
  beforeAll(async function () {
    await db.query("DELETE FROM users");
    const userData = await User.register('GrahaTia', 'password', 'Crystal Exarch');
    token = userData.token;
    validUserId = userData.user.id;
  })

  beforeEach(async function () {
    await db.query("DELETE FROM posts");
    const postData = await db.query(`INSERT INTO posts(title, description, body, author_id) 
                            VALUES
                                ('Strawberry Basil Soda', 
                                'initial description', 
                                'initial body', 
                                ${validUserId})
                            RETURNING id`);
    validPostId = postData.rows[0].id;
  });

  /** POST /posts => status 201, { post } */
  test("POST /posts - Create new post", async function () {
    const resp = await request(app)
      .post(`/posts`)
      .send({
        title: "test title",
        description: "test description",
        body: "test body",
        _token: token
      });
    expect(resp.body.post.description).toBe("test description");
    expect(resp.status).toBe(201);
  });

  /** GET /posts  => status 200, { posts } */
  test("GET /posts - retrieve all posts", async function () {
    const resp = await request(app)
      .get(`/posts`);
    expect(resp.status).toBe(200);
    expect(resp.body.posts.length).toBe(1);
  });

  /** GET /posts/search => status 200, { posts } */
  test("GET /posts/search - search for a user with a search term", async function () {
    const resp = await request(app)
      .get(`/posts/search?term=strawberry`);

    expect(resp.status).toBe(200);
    expect(resp.body.posts.length).toBe(1);
    expect(resp.body.posts[0].title).toBe("Strawberry Basil Soda");
  });

  afterAll(async () => {
    await db.end();
  });

  /** GET /posts/:postId  => status 200, { post } */
  test("GET /posts/:postId - retrieve a specific post by post id", async function () {
    const resp = await request(app)
      .get(`/posts/${validPostId}`);
    expect(resp.status).toBe(200);
    expect(resp.body.post.title).toBe("Strawberry Basil Soda");
  });

  /** PATCH /posts/:postId  => status 200, { lastUpdatedDate } */
  test("PATCH /posts/:postId - updates an existing post by post id", async function () {
    const resp = await request(app)
      .patch(`/posts/${validPostId}`)
      .send({
        title: "Blueberry Basil Soda",
        _token: token
      });
    expect(resp.status).toBe(200);
    expect(resp.body.last_updated_at).toBeDefined();
  });
  
  /** DELETE /posts/:postId  => status 200, { message } */
  test("DELETE /posts/:postId - updates an existing post by post id", async function () {
    const resp = await request(app)
      .delete(`/posts/${validPostId}`)
      .send({
        _token: token
      });
    expect(resp.status).toBe(200);
    expect(resp.body.message).toBe("Successfully deleted.");
  });

  afterAll(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM posts");
    await db.end();
  })
});