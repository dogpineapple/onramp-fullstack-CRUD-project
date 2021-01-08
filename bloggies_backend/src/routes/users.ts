import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../auth";
import User from "../models/user";
import express from "express";

export const usersRouter = express.Router();

/** POST /users/register - creates a new user. 
 * Returns user object & jwt */
usersRouter.post("/register", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, display_name } = req.body;
    const result = await User.register(username, password, display_name);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /users/login - authenticate credentials and login a user. 
 * Returns user object & jwt*/
usersRouter.post("/login", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const result = await User.authenticate(username, password);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

/** GET /users/:id - gets a specific user by user id. Requires logged in. 
 * Return a user object */
usersRouter.get("/:id", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const user = await User.getUser(parseInt(req.params.id));
  return res.json({ user })
});