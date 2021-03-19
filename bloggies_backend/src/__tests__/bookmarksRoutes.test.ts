import request from "supertest";
import app from "../app";
import db from "../db";
import User from "../models/user";
import UserAuth from "../models/userAuth";

let token: string;
let validUserId: number;
let validPostId: number;
let validNotFavPostId: number;

describe("Test Bookmarks routes", function () {
  beforeAll(async function () {
    await db.query("DELETE FROM users");
    const userAuthData = await UserAuth.register('GrahaTia', 'password');
    await User.createUser(userAuthData.user.id, 'CrystalExarch');
    token = userAuthData.token;
    validUserId = userAuthData.user.id;
  })

  beforeEach(async function () {
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM bookmarks");
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

    await db.query(`INSERT INTO bookmarks(post_id, user_id) VALUES (${validPostId}, ${validUserId})`);
  });

  /** GET /bookmarks/:uid => status 200, { posts }.**/
  test("GET /bookmarks/:uid - retrieve bookmarked posts for a user by user id", async function () {
    const resp = await request(app).get(`/bookmarks/${validUserId}`);
    expect(resp.status).toBe(200);
    expect(resp.body.posts.length).toBe(1);
  });

  /** POST /bookmarks => status 201, { message }.**/
  test("POST /bookmarks - add a bookmark post to a user", async function () {
    const resp = await request(app).post(`/bookmarks`)
      .set('Cookie', [`token=${token}`])
      .send({ postId: validNotFavPostId });
      
    expect(resp.status).toBe(201);
    expect(resp.body.message).toBe("Bookmarked successfully.");
  });

  /** POST /bookmarks => status 401, { message }.**/
  test("POST /bookmarks - add a bookmark post to a user", async function () {
    const resp = await request(app).post(`/bookmarks`).send({ postId: validNotFavPostId });
    expect(resp.status).toBe(401);
  });

  /** DELETE /bookmarks => status 200, { posts }.**/
  test("DELETE /bookmarks - remove a bookmark post from a user", async function () {
    const resp = await request(app).delete(`/bookmarks`)
      .set('Cookie', [`token=${token}`])
      .send({ postId: validPostId });

    expect(resp.status).toBe(200);
    expect(resp.body.message).toBe("Unbookmarked successfully.");
  });

  afterAll(async () => {
    await db.query("DELETE FROM bookmarks");
    await db.query("DELETE FROM posts");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM user_auth");
    await db.end();
  });
});