import User from "../models/user";
import db from "../db";
import bcrypt from "bcrypt";
import * as dotenv from 'dotenv';

dotenv.config({path: __dirname + '/env'});

const {BCRYPT_WORK_FACTOR} = process.env;

let validUserId: number;

/** Tests for User model */
describe("Test User class", function () {
  beforeAll(async function () {
    await db.query("DELETE FROM users");

    const password = 'password';
    const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const userRes = await db.query(
      `INSERT INTO users (username, display_name, hashed_pwd)
      VALUES ($1, $2, $3)
      RETURNING id`,
      ['username', 'Laliho', hashedPwd]);

    validUserId = userRes.rows[0].id;
  });

  test("can register", async function () {
    const res = await User.register(
      "test", "password", "test name");
    expect(res.user.username).toBe("test");
    expect(res.user.display_name).toBe("test name")
  });

  test("can handle duplicate username", async function () {
    try {
      await User.register("username", "password", "hello there");
      fail("user was created with a duplicate username");
    } catch (err) {
      expect(err.message).toBe("Username already exists");
      expect(err.status).toBe(400);
    }
  });

  test("can authenticate", async function () {
    const res = await User.authenticate("username", "password");
    expect(res.user.username).toBe("username");
    expect(res.user.display_name).toBe("Laliho");
  });

  test("can handle invalid username authentication", async function () {
    try {
      await User.authenticate("idontexist", "password");
    } catch (err) {
      expect(err.message).toBe("User does not exist, please try again")
    }
  });

  test("can handle invalid password authentication", async function () {
    try {
      await User.authenticate("username", "thispasswordiswrong");
    } catch (err) {
      expect(err.message).toBe("Credentials do not match, please try again")
    }
  });

  test("can retrieve user", async function () {
    const user = await User.getUser(validUserId);
    expect(user).toEqual({
      id: validUserId,
      username: "username",
      display_name: "Laliho",
      join_date: expect.any(Date)
    });
  });

  test("can search users", async function () {
    const users = await User.searchUsers("Lali");
    expect(users[0]).toEqual({
      id: validUserId,
      username: "username",
      display_name: "Laliho",
      join_date: expect.any(Date)
    });
  });

  afterAll(async () => {
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.end();
  });
});