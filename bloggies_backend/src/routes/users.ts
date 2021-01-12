import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../auth";
import User from "../models/user";
import express from "express";
import ExpressError from "../expressError";

export const usersRouter = express.Router();

/** POST /users/register - creates a new user. 
 * Returns user object & jwt */
usersRouter.post("/register", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, display_name } = req.body;
    if (username && password && display_name) {
      const result = await User.register(username, password, display_name);
      return res.status(201).json(result);
    }
    throw new ExpressError("Invalid registration values. Check all fields.", 400);
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

/** SEARCH /users/search?term=[term] - get all users matching search term. 
 * Returns users */
usersRouter.get("/search", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const term = req.query.term;
    if (term) {
      const users = await User.searchUsers(term.toString());
      return res.json({ users });
    }
    throw new ExpressError("Invalid search term", 400);
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