import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import express from "express";
import Favorite from "../models/favorite";

export const favoritesRouter = express.Router();

/** GET /favorites/:uid - retrieve favorited posts for a user.
 * Returns a list of posts */
favoritesRouter.get("/:uid", async function (req: Request, res: Response, next: NextFunction) {
  const userId = parseInt(req.params.uid);
  try {
    const posts = await Favorite.getAll(userId);
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

/** POST /favorites - add a favorite post to a user.
 **/
favoritesRouter.post("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user;
  const { postId } = req.body;
  try {
    const result = await Favorite.add(currentUser.user_id, postId);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /favorites - add a favorite post to a user.
 **/
favoritesRouter.delete("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user;
  const { postId } = req.body;
  try {
    const result = await Favorite.delete(currentUser.user_id, postId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});