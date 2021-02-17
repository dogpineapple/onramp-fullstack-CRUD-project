import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import User from "../models/user";
import express from "express";
import ExpressError from "../expressError";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../s3";
import { PHOTO_BUCKET } from "../config";
import { ensureNoCooldown } from "../middleware/middlewares";

export const usersRouter = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: PHOTO_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldname: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname + Date.now().toString());
    }
  })
});

/** POST /users/register - creates a new user. 
 * Returns user object & jwt */
usersRouter.post("/register", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, display_name } = req.body;
    if (username && password && display_name) {
      const result = await User.register(username, password, display_name);
      res.cookie("token", result.token);
      return res.status(201).json(result);
    }
    console.log("register event with: ", username, password, display_name);
    throw new ExpressError("Invalid registration values. Check all fields.", 400);
  } catch (err) {
    return next(err);
  }
});

/** POST /users/upload-photo - uploads an existing user's profile photo. 
 * Returns user object */
usersRouter.post("/upload-photo", ensureLoggedIn, ensureNoCooldown, upload.single("upload"), async function (req: Request, res: Response, next: NextFunction) {
  try {
    await User.updatePhoto(req.user.user_id, (req.file as any).location);
    console.log("uploading photo", (req.file as any).location);
    return res.json({ "photoUrl": (req.file as any).location });
  } catch (err) {
    return next(err);
  }
});

/** POST /users/login - authenticate credentials and login a user. 
 * Returns user object & jwt*/
usersRouter.post("/login", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const result = await User.authenticate(username, password);
    res.cookie("token", result.token);
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

/** GET /users/:id/photo - Get a specific user's profile photo url. 
 * Return a photo_url */
usersRouter.get("/:id/photo", async function (req: Request, res: Response, next: NextFunction) {
  const userId = req.params.id;
  const user = await User.getUser(parseInt(userId));
  return res.json({ photo_url: user.photo_url });
});

/** GET /users - get the currently logged in user. Requires logged in. 
 * Return a user object */
usersRouter.get("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const userId = req.user.user_id;
  const user = await User.getUser(parseInt(userId));
  return res.json({ user })
});