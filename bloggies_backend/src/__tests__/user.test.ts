import User from "../models/user";
import db from "../db";
import { NONE } from "../membershipEligibility";

let validUserId: number;

/** Tests for User model */
describe("Test User class", function () {
  beforeAll(async function () {
    await db.query("DELETE FROM user_auth");
    await db.query("DELETE FROM users");

    const userAuthRes = await db.query(
      `INSERT INTO user_auth (email, hashed_pwd)
      VALUES ($1, $2)
      RETURNING id`,
      ['testuser@test.com', 'password']);

    validUserId = userAuthRes.rows[0].id;

    await db.query(
      `INSERT INTO users (user_id, display_name)
      VALUES ($1, $2)`,
      [validUserId, 'testdisplayname']);
  });

  test("can retrieve user", async function () {
    const user = await User.getUser(validUserId);
    expect(user).toEqual({
      id: validUserId,
      display_name: "testdisplayname",
      membership_status: NONE,
      membership_start_date: null,
      membership_end_date: null,
      last_submission_date: null
    });
  });

  test("can search users", async function () {
    const users = await User.searchUsers("testdisplay");
    expect(users[0]).toEqual({
      id: validUserId,
      display_name: "testdisplayname",
      last_submission_date: null
    });
  });

  afterAll(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM user_auth");
    await db.query("ALTER SEQUENCE user_auth_id_seq RESTART WITH 1");
    await db.end();
  });
});