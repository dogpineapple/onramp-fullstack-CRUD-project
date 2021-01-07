import { NextFunction, Response, Request } from "express";
import { SECRET_KEY } from "./config";
import ExpressError from "./expressError";
import jwt from "jsonwebtoken";

/** Middleware for checking JWT validity */
export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.body._token;
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware for ensuring user is logged in. */
export function ensureLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new ExpressError("Sign-in required", 401));
  } else {
    return next();
  }
}
