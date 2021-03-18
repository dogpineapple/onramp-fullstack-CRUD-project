import bcrypt from "bcrypt";
import db from "../db";
import UserAuth from "../models/userAuth";
import { BCRYPT_WORK_FACTOR } from '../config';

/** Tests for UserAuth model */
describe("Test UserAuth class", function () {
  beforeAll(async function () {
    await db.query("DELETE FROM users");

    const password = 'password';
    const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    await db.query(
      `INSERT INTO user_auth(email, hashed_pwd)
      VALUES ($1, $2)
      RETURNING id`,
      ['email', hashedPwd]);
  });

  test("can register", async function () {
    const res = await UserAuth.register(
      "test@test.com", "password");
    expect(res.user.email).toBe("test@test.com");
  });

  test("can handle duplicate email", async function () {
    try {
      await UserAuth.register("email", "password");
      fail("user was created with a duplicate email");
    } catch (err) {
      expect(err.message).toBe("Email already exists");
      expect(err.status).toBe(400);
    }
  });

  test("can authenticate", async function () {
    const res = await UserAuth.authenticate("email", "password");
    expect(res.user.email).toBe("email");
  });

  test("can handle invalid email authentication", async function () {
    try {
      await UserAuth.authenticate("idontexist", "password");
    } catch (err) {
      expect(err.message).toBe("User does not exist, please try again");
      expect(err.status).toBe(400);
    }
  });

  test("can handle invalid password authentication", async function () {
    try {
      await UserAuth.authenticate("email", "thispasswordiswrong");
    } catch (err) {
      expect(err.message).toBe("Credentials do not match, please try again");
      expect(err.status).toBe(400);
    }
  });

  afterAll(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM user_auth");
    await db.query("ALTER SEQUENCE user_auth_id_seq RESTART WITH 1");
    await db.end();
  });
});