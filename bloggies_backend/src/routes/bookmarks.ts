import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import express from "express";
import Favorite from "../models/bookmarks";

export const bookmarksRouter = express.Router();

/** GET /bookmarks/:uid - retrieve favorited posts for a user.
 * Returns a list of posts */
bookmarksRouter.get("/:uid", async function (req: Request, res: Response, next: NextFunction) {
  const userId = parseInt(req.params.uid);
  try {
    const posts = await Favorite.getAllBookmarks(userId);
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

/** POST /bookmarks - add a favorite post to a user.
 **/
bookmarksRouter.post("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user;
  const { postId } = req.body;
  try {
    const result = await Favorite.createBookmark(currentUser.user_id, postId);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /bookmarks - add a favorite post to a user.
 **/
bookmarksRouter.delete("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user;
  const { postId } = req.body;
  try {
    const result = await Favorite.deleteBookmark(currentUser.user_id, postId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});