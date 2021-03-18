import express, { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import User from "../models/user";
import ExpressError from "../expressError";

export const usersRouter = express.Router();

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