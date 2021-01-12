import request from "supertest";
import app from "../app";
import db from "../db";
import User from "../models/user";

let token: string;
let validUserId: number;
let validPostId: number;
let validNotFavPostId: number;

describe("Test Post routes", function () {
  beforeAll(async function () {
    await db.query("DELETE FROM users");
    const userData = await User.register('GrahaTia', 'password', 'Crystal Exarch');
    token = userData.token;
    validUserId = userData.user.id;
  })

  beforeEach(async function () {
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM favorites");
    const postData = await db.query(`INSERT INTO posts(title, description, body, author_id) 
                            VALUES
                                ('Strawberry Basil Soda', 
                                'initial description', 
                                'initial body', 
                                ${validUserId})
                            RETURNING id`);
    validPostId = postData.rows[0].id;

    const extraPostData = await db.query(`INSERT INTO posts(title, description, body, author_id) 
                            VALUES
                                ('extra post', 
                                'initial description', 
                                'initial body', 
                                ${validUserId})
                            RETURNING id`);
    validNotFavPostId = extraPostData.rows[0].id;

    await db.query(`INSERT INTO favorites(post_id, user_id) VALUES (${validPostId}, ${validUserId})`)
  });

  /** GET /favorites/:uid => status 200, { posts }.**/
  test("GET /favorites/:uid - retrieve favorited posts for a user by user id", async function () {
    const resp = await request(app).get(`/favorites/${validUserId}`);
    expect(resp.status).toBe(200);
    expect(resp.body.posts.length).toBe(1);
  });

  /** POST /favorites => status 201, { message }.**/
  test("POST /favorites - add a favorite post to a user", async function () {
    const resp = await request(app).post(`/favorites`).send({ postId: validNotFavPostId, _token: token});
    expect(resp.status).toBe(201);
    expect(resp.body.message).toBe("Favorited successfully.");
  });

  /** DELETE /favorites => status 200, { posts }.**/
  test("DELETE /favorites - remove a favorite post from a user", async function () {
    const resp = await request(app).delete(`/favorites`).send({ postId: validPostId, _token: token});
    expect(resp.status).toBe(200);
    expect(resp.body.message).toBe("Unfavorited successfully.");
  });

  afterAll(async () => {
    await db.query("DELETE FROM favorites");
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.end();
  });
});