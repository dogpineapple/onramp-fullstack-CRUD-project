

describe("Test User class", function () {
  beforeEach(async function () {
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
    const res = await User.authenticate(
      "username", "password");
    expect(res.message).toBe("Login successful");
  });

  test("can retrieve user", async function () {
    const user = await User.getUser(1);
    expect(user).toEqual({
      user_id: 1,
      username: "username",
      display_name: "display name",
      join_date: expect.any(Date)
    });
  });


});