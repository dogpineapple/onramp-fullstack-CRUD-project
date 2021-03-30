import express, { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import User from "../models/user";
import ExpressError from "../expressError";
import Email from "../models/email";
import { stripe } from "./stripe";
import { ACTIVE } from "../membershipStatuses";
import Stripe from "stripe";

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
  } catch (err) {
    return next(err);
  }
});

/** UPDATE membership status - user must be logged in, and status is updated based on the "appStatus" parameter in req.body */
/** this will also trigger an email */
/** returns updated User object (user_id, status, membership_start_date, membership_end_date) */
usersRouter.patch("/status-update", ensureLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  const { appStatus } = req.body;
  const { user_id, email } = req.user;

  let sub: Stripe.Subscription;
  let updatedUser;

  //add some validation here?
  try {
    if (appStatus === ACTIVE) {
      const currUser = await User.getUser(user_id);
      sub = await stripe.subscriptions.retrieve(currUser.subscription_id);
      updatedUser = await User.updateMembership(user_id, appStatus, sub.current_period_start, sub.current_period_end);
    } else {
      updatedUser = await User.updateMembership(user_id, appStatus);
    }
    await Email.sendConfirmation(email, appStatus);
    return res.json(updatedUser);
  } catch (err) {
    return next(err);
  }
});

usersRouter.get("/membership-status", ensureLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.user;

  try {
    const status = await User.checkMembershipStatus(user_id);
    res.send(status);
  } catch (err) {
    return next(err);
  }
});


//route for testing membership expiration check with Postman and sending email to results
//this is not currently needed
usersRouter.get("/all-memberships", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expiring = await User.checkExpiringMemberships();
    expiring.forEach(async (user) => {
      const resp = await Email.sendEndDateWarning(user);
      console.log(resp);
    })
    res.send(expiring);
  } catch(err) {
    return next(err);
  }
});
