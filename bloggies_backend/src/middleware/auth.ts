import { NextFunction, Response, Request } from "express";
import { SECRET_KEY } from "../config";
import ExpressError from "../expressError";
import jwt from "jsonwebtoken";

/*bug in code below, SECRET_KEY importing as undefined, will fix soon so we can delete SECRET_KEY from config file
*/
// import * as dotenv from 'dotenv';

// dotenv.config({path: __dirname + '/env' })
// const { SECRET_KEY } = process.env;
// console.log(SECRET_KEY);
/** Middleware for checking JWT validity */
export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  try {
    // const token = req.body._token;
    const cookieToken = req.cookies.token;
    const payload = jwt.verify(cookieToken, SECRET_KEY as string);
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
