import { NextFunction, Response, Request } from "express";
import { USER_UPDATE_COOLDOWN } from "../config";
import ExpressError from "../expressError";
import User from "../models/user";

export async function ensureNoCooldown(req: Request, res: Response, next: NextFunction) {
  // check if the cooldown (1 minute) has passed to prevent spamming.
  const lastUpdatedAt = await User.getLastUpdated(req.user.user_id);
  if (lastUpdatedAt) {
    let currentTime = new Date().getTime();
    let lastUpdatedTime = new Date(lastUpdatedAt).getTime();

    if ((currentTime - lastUpdatedTime) >= USER_UPDATE_COOLDOWN) {
      return next();
    }

    let err = new ExpressError("Update cooldown in progress. Please wait 1 minute after each update.", 400);
    return next(err);
  }
}