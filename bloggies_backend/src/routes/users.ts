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
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /users/login - authenticate credentials and login a user. 
 * Returns user object & jwt*/
usersRouter.post("/login", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    console.log("req.body", req.body);
    const result = await User.authenticate(username, password);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

/** GET /users - get the currently logged in user. Requires logged in. 
 * Return a user object */
usersRouter.get("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const userId = req.user.user_id;
  const user = await User.getUser(parseInt(userId));
  return res.json({ user })
});