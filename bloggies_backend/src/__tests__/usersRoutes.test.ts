
import request from "supertest"
import jwt from "jsonwebtoken";
import app from "../app";
import db from "../db";
// import User from "../models/user";
import UserAuth from "../models/userAuth";


describe("Test User routes", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM users");

    await UserAuth.register('GrahaTia@test.com', 'password');
  });

  /** POST /users/register => status 201, { user, token } */
  test("POST /users/register - Create new user", async function () {
    const resp = await request(app)
                        .post(`/users/register`)
                        .send({
                          username: "userRouteTest",
                          password: "password",
                          display_name: "user route test"
                        });
    let token = resp.body.token;
    expect(jwt.decode(token)).toEqual({
      iat: expect.any(Number),
      username: "userRouteTest",
      user_id: expect.any(Number)
    });
    expect(resp.status).toBe(201); 
  });

  /** POST /users/register => status 400, { error } */
  test("POST /users/register - handle bad values to register", async function () {
    const resp = await request(app)
                        .post(`/users/register`)
                        .send({
                          username: "",
                          password: "password",
                          display_name: "user route test"
                        });
    
    expect(resp.status).toBe(400); 
    expect(resp.body.error.message).toBe("Invalid registration values. Check all fields."); 
  });

  /** POST /users/register => status 400, { error } */
  test("POST /users/register - handle duplicate username register", async function () {
    const resp = await request(app)
                        .post(`/users/register`)
                        .send({
                          username: "GrahaTia",
                          password: "password",
                          display_name: "user route test"
                        });
    
    expect(resp.status).toBe(400);
    expect(resp.body.error.message).toBe("Username already exists"); 
  });

  /** POST /users/login  => status 200, { user, token } */
  test("POST /users/login - login a user", async function () {
    const resp = await request(app)
                        .post(`/users/login`)
                        .send({
                          username: "GrahaTia",
                          password: "password"
                        });
    let token = resp.body.token;
    expect(jwt.decode(token)).toEqual({
      iat: expect.any(Number),
      username: "GrahaTia",
      user_id: expect.any(Number)
    });
    expect(resp.status).toBe(200); 
  });

  /** POST /users/login  => status 400, { error } */
  test("POST /users/login - handle login a non-existant", async function () {
    const resp = await request(app)
                        .post(`/users/login`)
                        .send({
                          username: "idontexist",
                          password: "password"
                        });
    expect(resp.status).toBe(400); 
    expect(resp.body.error.message).toBe("User does not exist, please try again");
  });

  /** POST /users/login  => status 400, { error } */
  test("POST /users/login - handle login a bad password", async function () {
    const resp = await request(app)
                        .post(`/users/login`)
                        .send({
                          username: "GrahaTia",
                          password: "wrongpassword"
                        });
    expect(resp.status).toBe(400); 
    expect(resp.body.error.message).toBe("Credentials do not match, please try again");
  });

  /** GET /users/search  => status 200, { users } */
  test("GET /users/search - search for a user with a search term", async function () {
    const resp = await request(app)
                        .get(`/users/search?term=crystal`);
    expect(resp.status).toBe(200); 
    expect(resp.body.users.length).toBe(1);
    expect(resp.body.users[0].display_name).toBe("Crystal Exarch");
  });

  afterAll(async () => {
    await db.end();
  });
});