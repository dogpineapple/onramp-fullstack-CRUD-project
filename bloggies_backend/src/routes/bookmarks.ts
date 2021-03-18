import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import express from "express";
import Bookmark from "../models/bookmark";

export const bookmarksRouter = express.Router();

/** GET /bookmarks/:uid - retrieve bookmarked posts for a user.
 * Returns a list of posts */
bookmarksRouter.get("/:uid", async function (req: Request, res: Response, next: NextFunction) {
  const userId = parseInt(req.params.uid);
  try {
    const posts = await Bookmark.getAllBookmarks(userId);
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

/** POST /bookmarks - add a bookmark post to a user.
 **/
bookmarksRouter.post("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user;
  const { postId } = req.body;
  try {
    const result = await Bookmark.createBookmark(currentUser.user_id, postId);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /bookmarks - add a bookmark post to a user.
 **/
bookmarksRouter.delete("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user;
  const { postId } = req.body;
  try {
    const result = await Bookmark.deleteBookmark(currentUser.user_id, postId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});