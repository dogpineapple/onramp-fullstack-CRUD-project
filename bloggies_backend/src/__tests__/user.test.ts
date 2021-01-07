import User from "../models/user";
import db from "../db";

describe("Test User class", function () {
  beforeAll(async function () {
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await User.register(
      "username", "password", "display name");
  });

  test("can register", async function () {
    const res = await User.register(
      "test", "password", "test name");
    expect(res.user.username).toBe("test");
    expect(res.user.display_name).toBe("test name")
  });

  test("can authenticate", async function () {
    const res = await User.authenticate("username", "password");
    expect(res.message).toBe("Login successful");
  });

  test("can retrieve user", async function () {
    const user = await User.getUser(1);
    expect(user).toEqual({
      id: 1,
      username: "username",
      display_name: "display name",
      join_date: expect.any(Date)
    });
  });

  test("can handle duplicate username", async function() {
    try {
      await User.register("username", "password", "hello there");
      fail("user was created with a duplicate username");
    } catch (err) {
      expect(err.message).toBe("Username already exists");
      expect(err.status).toBe(400);
    }
  });
});