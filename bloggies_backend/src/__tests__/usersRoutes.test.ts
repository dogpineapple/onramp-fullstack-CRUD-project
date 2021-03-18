
import request from "supertest"
import app from "../app";
import db from "../db";
import UserAuth from "../models/userAuth";
import User from "../models/user";
import { NONE } from "../membershipEligibility";


describe("Test User routes", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM user_auth");

    const userAuthRes = await UserAuth.register('GrahaTia@test.com', 'password');
    await User.createUser(userAuthRes.user.id, 'grahatest');
  });

  /** POST /user-auth/register => status 201, { user, token } */
  test("POST /user-auth/register - Create new user", async function () {
    const resp = await request(app)
      .post(`/user-auth/register`)
      .send({
        email: "userRouteTest@test.com",
        password: "password",
        display_name: "thisistest"
      });
    let user = resp.body.user;
    expect(resp.status).toBe(201);
    expect(user).toStrictEqual({
      id: expect.any(Number),
      email: "userRouteTest@test.com",
      display_name: "thisistest",
      membership_eligibility: NONE,
      membership_active: false,
      membership_start_date: null,
      membership_end_date: null,
      last_submission_date: null
    });
  });

  /** POST /user-auth/register => status 400, { error } */
  test("POST /user-auth/register - handle bad values to register", async function () {
    const resp = await request(app)
      .post(`/user-auth/register`)
      .send({
        username: "",
        password: "password",
        display_name: "user route test"
      });

    expect(resp.status).toBe(400);
    expect(resp.body.error.message).toBe("Invalid registration values. Check all fields.");
  });

  /** POST /users/register => status 400, { error } */
  test("POST /user-auth/register - handle duplicate email register", async function () {
    const resp = await request(app)
      .post(`/user-auth/register`)
      .send({
        email: "GrahaTia@test.com",
        password: "password",
        display_name: "thisistest"
      });

    expect(resp.status).toBe(400);
    expect(resp.body.error.message).toBe("Email already exists");
  });

  /** POST /users/login  => status 200, { user, token } */
  test("POST /user-auth/login - login a user", async function () {
    const resp = await request(app)
      .post(`/user-auth/login`)
      .send({
        email: "GrahaTia@test.com",
        password: "password"
      });
    let user = resp.body.user;
    expect(resp.status).toBe(200);
    expect(user).toStrictEqual({
      id: expect.any(Number),
      email: "GrahaTia@test.com",
      display_name: "grahatest",
      membership_eligibility: NONE,
      membership_active: false,
      membership_start_date: null,
      membership_end_date: null,
      last_submission_date: null
    });
  });

  /** POST /users/login  => status 400, { error } */
  test("POST /user-auth/login - handle login a non-existant", async function () {
    const resp = await request(app)
      .post(`/user-auth/login`)
      .send({
        email: "idontexist@test.com",
        password: "password"
      });
    expect(resp.status).toBe(400);
    expect(resp.body.error.message).toBe("User does not exist, please try again");
  });

  /** POST /users/login  => status 400, { error } */
  test("POST /user-auth/login - handle login a bad password", async function () {
    const resp = await request(app)
      .post(`/user-auth/login`)
      .send({
        email: "GrahaTia@test.com",
        password: "wrongpassword"
      });
    expect(resp.status).toBe(400);
    expect(resp.body.error.message).toBe("Credentials do not match, please try again");
  });

  /** GET /users/search  => status 200, { users } */
  test("GET /users/search - search for a user with a search term", async function () {
    const resp = await request(app)
      .get(`/users/search?term=graha`);
    expect(resp.status).toBe(200);
    expect(resp.body.users.length).toBe(1);
    expect(resp.body.users[0].display_name).toBe("grahatest");
  });

  afterAll(async () => {
    await db.end();
  });
});