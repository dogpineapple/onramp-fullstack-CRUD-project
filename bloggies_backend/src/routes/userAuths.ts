import express, { NextFunction, Request, Response } from "express";
import ExpressError from "../expressError";
import UserAuth from "../models/userAuth";
import User from "../models/user";
import Checkout from "../models/stripe";

export const userAuthRouter = express.Router();

/** POST /user-auth/register - creates a new user.
 * Returns user object & a jwt cookie */
userAuthRouter.post("/register", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, display_name } = req.body;

    if (email && password && display_name) {
      const notUnique = await User.checkForUniqueDisplayName(display_name);
      if(notUnique) throw new ExpressError("That Display Name is already taken. Please choose another one", 403);

      const authResult = await UserAuth.register(email, password);
      const userInfo = await User.createUser(authResult.user.id, display_name);
      console.log('User Info: ', userInfo)
      const respObject = {
        user: {
          ...authResult.user,
          ...userInfo
        }
      };
      res.cookie("token", authResult.token);

      return res.status(201).json(respObject);
    }
    console.log("register event with: ", email, display_name);
    throw new ExpressError("Invalid registration values. Check all fields.", 400);
  } catch (err) {
    return next(err);
  }
});

/** POST /user-auth/login - authenticate credentials and login a user.
 * Returns user object & a jwt cookie*/
userAuthRouter.post("/login", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const authResult = await UserAuth.authenticate(email, password);
    const user = await User.getUser(authResult.user.id);

    res.cookie("token", authResult.token);

    const now = new Date();
    const isOverdue = user.cancel_at ? now >= user.cancel_at : false;

    if(isOverdue) {
      try{
        await Checkout.stripeSubscriptionCancel(user.subscription_id);
      } catch(err) {
        return next(err);
      }
    }
    const updatedUser = await User.getUser(user.id);
    return res.json({ user: { ...updatedUser, email } });
  } catch (err) {
    return next(err);
  }
});

/** gives us a way to test logging out on the back end */
userAuthRouter.post("/logout", async function (req: Request, res: Response, next: NextFunction) {
  res.cookie("token", null);
  const logout = 'user logged out'
  return res.send(logout);
})