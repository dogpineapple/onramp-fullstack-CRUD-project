import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import express from "express";
import Bookmark from "../models/bookmark";

export const bookmarksRouter = express.Router();

/** GET /bookmarks/ - retrieve bookmarked posts for the current user.
 * Returns a list of posts */
bookmarksRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
  const userId = req.user ? parseInt(req.user.user_id) : null;
  try {
    if(userId) {
      const posts = await Bookmark.getAllBookmarks(userId);
      return res.json({ posts });
    }

  } catch (err) {
    return next(err);
  }
});

/** POST /bookmarks - add a bookmark post to a user.
 **/
bookmarksRouter.post("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const userId = req.user.user_id;
  const { postId } = req.body;
  try {
    const result = await Bookmark.createBookmark(userId, postId);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /bookmarks - add a bookmark post to a user.
 **/
bookmarksRouter.delete("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const userId = req.user.user_id;
  const { postId } = req.body;
  try {
    const result = await Bookmark.deleteBookmark(userId, postId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});