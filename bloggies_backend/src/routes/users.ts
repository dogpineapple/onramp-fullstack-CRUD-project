import express, { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import User from "../models/user";
import ExpressError from "../expressError";
import Email from "../models/email";

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
  try {
    const userId = req.user.user_id;
    const user = await User.getUser(parseInt(userId));
    return res.json({ user })
  } catch(err) {
    return next(err);
  }
});

/** UPDATE membership status - user must be logged in, and status is updated based on the "appStatus" parameter in req.body */
/** this will also trigger an email */
/** returns updated User object (user_id, status, membership_start_date, membership_end_date) */
usersRouter.put("/status-update", ensureLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  const { appStatus } = req.body;
  const { user_id, email } = req.user;
  
  //add some validation here?

  try {
    const updatedUser = await User.updateMembership(user_id, appStatus);
    await Email.sendConfirmation(email, appStatus);
    return res.json(updatedUser);

  } catch(err) {
    return next(err);
  }
});

usersRouter.get("/membership-status", ensureLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.user;

  try {
    const status = await User.checkMembershipStatus(user_id);
    res.send(status);
  } catch(err) {
    return next(err);
  }
});


//route for testing membership expiration check with Postman
//set admin permissions?
usersRouter.get("/all-memberships", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expiring = await User.checkExpiringMemberships();
    res.send(expiring);
  } catch(err) {
    return next(err);
  }
});