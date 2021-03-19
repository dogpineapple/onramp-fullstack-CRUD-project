import request from "supertest";
import app from "../app";
import db from "../db";
import User from "../models/user";
import UserAuth from "../models/userAuth";

let token: string;
let validUserId: number;
let validPostId: number;
let secondToken: string;

describe("Test Post routes", function () {
  beforeAll(async function () {
    await db.query("DELETE FROM users");

    const userData = await UserAuth.register('GrahaTia', 'password');
    token = userData.token;
    validUserId = userData.user.id;

    await User.createUser(validUserId, 'Crystal Exarch')

    const anotherUserData = await UserAuth.register('Gaia', 'password');
    secondToken = anotherUserData.token;

    await User.createUser(anotherUserData.user.id, "ff14");
  })

  beforeEach(async function () {
    await db.query("DELETE FROM posts");
    const postData = await db.query(`INSERT INTO posts(title, description, body, author_id, is_premium) 
                            VALUES
                                ('Strawberry Basil Soda', 
                                'initial description', 
                                'initial body', 
                                ${validUserId},
                                false)
                            RETURNING id`);
    validPostId = postData.rows[0].id;
  });

  /** POST /posts => status 201, { post } */
  test("POST /posts - Create new post", async function () {
    const resp = await request(app)
      .post(`/posts`)
      .set('Cookie', [`token=${token}`])
      .send({
        title: "test title",
        description: "test description",
        body: "test body",
        is_premium: false
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
      .set('Cookie', [`token=${token}`])
      .send({
        title: "Blueberry Basil Soda"
      });
    expect(resp.status).toBe(200);
    expect(resp.body.last_updated_at).toBeDefined();
  });

  /** PATCH /posts/:postId  => status 401, { err } */
  test("PATCH /posts/:postId - handle updates a post with no token", async function () {
    const resp = await request(app)
      .patch(`/posts/${validPostId}`)
      .send({
        title: "Blueberry Basil Soda"
      });
    expect(resp.status).toBe(401);
  });

  /** PATCH /posts/:postId  => status 401, { err } */
  test("PATCH /posts/:postId - handle updates a post as not the post's author", async function () {
    const resp = await request(app)
      .patch(`/posts/${validPostId}`)
      .set('Cookie', [`token=${secondToken}`])
      .send({
        title: "Blueberry Basil Soda"
      });
    expect(resp.status).toBe(401);
    expect(resp.body.error.message).toBe("Update failed: token does not belong to the post author.");
  });

  /** DELETE /posts/:postId  => status 200, { message } */
  test("DELETE /posts/:postId - deletes an existing post by post id with valid token", async function () {
    const resp = await request(app)
      .delete(`/posts/${validPostId}`)
      .set('Cookie', [`token=${token}`]);

    expect(resp.status).toBe(200);
    expect(resp.body.message).toBe("Successfully deleted.");
  });

  afterAll(async () => {
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM user_auth");
    await db.end();
  })
});