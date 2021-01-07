import { NextFunction, Response } from "express";
import { IUserRequest } from "./interfaces";

/** Middleware for checking JWT validity */
export function authenticateJWT(req: IUserRequest, res: Response, next: NextFunction) {
  try {
    const token = req.body?._token;
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware for ensuring user is logged in. */
export function ensureLoggedIn(req: IUserRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new ExpressError("Sign-in required", 401));
  } else {
    return next();
  }
}

export function ensureSameUser(req: IUserRequest, res: Response, next: NextFunction) {
  
}