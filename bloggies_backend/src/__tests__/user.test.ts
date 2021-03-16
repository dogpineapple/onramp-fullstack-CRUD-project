import User from "../models/user";
import db from "../db";

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
      `INSERT INTO users (user_id, display_name, membership_status)
      VALUES ($1, $2, $3)`,
      [validUserId, 'testdisplayname', 'pending']);
  });

  test("can retrieve user", async function () {
    const user = await User.getUser(validUserId);
    expect(user).toEqual({
      user_id: validUserId,
      display_name: "testdisplayname",
      membership_status: "pending",
      membership_start_date: null,
      membership_end_date: null,
      last_submission_date: null
    });
  });

  test("can search users", async function () {
    const users = await User.searchUsers("testdisplay");
    expect(users[0]).toEqual({
      user_id: validUserId,
      display_name: "testdisplayname",
      membership_status: "pending",
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