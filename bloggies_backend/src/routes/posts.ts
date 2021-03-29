import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../middleware/auth";
import Post from "../models/post";
import express from "express";
import ExpressError from "../expressError";
import User from "../models/user";
import { ACTIVE } from "../membershipStatuses";
import { timePeriod } from "../utils";

export const postsRouter = express.Router();

/** POST /posts - creates a new post.
 * Returns post object */
postsRouter.post("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { user_id } = req.user;
    const user = await User.getUser(user_id);
    if (user.membership_status === ACTIVE) {
      const { title, description, body, is_premium } = req.body;
      const post = await Post.createPost(title, description, body, user_id, is_premium);
      const currentDate = Math.ceil(Date.now() / 1000);
      const updatedCancelAt = currentDate + timePeriod;
        await User.updateUser(user_id, {last_submission_date: currentDate, cancel_at: updatedCancelAt})
      return res.status(201).json({ post });
    }
    return next(new ExpressError("A membership is required to publish a post.", 403));
  } catch (err) {
    return next(err);
  }
});


/** GET /posts - get all free posts for regular users and all posts for premium users
 * Returns posts */
postsRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
  const userId = req.user ? req.user.user_id : null;
  try {
    const status = await User.checkMembershipStatus(userId);
    const membershipStatus = status ? status.membership_status : null;
    const posts = await Post.getAllPosts(membershipStatus);
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

/** SEARCH /posts/search?term=[term] - get all posts.
 * Returns posts */
postsRouter.get("/search", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const term = req.query.term;
    if (term) {
      const posts = await Post.searchPosts(term.toString());
      return res.json({ posts });
    }
    throw new ExpressError("Invalid search term", 400);
  } catch (err) {
    return next(err);
  }
});

/** GET /posts/:postId - get a specific post by post id.
 * Returns post */
postsRouter.get("/:id", async function (req: Request, res: Response, next: NextFunction) {
  const postId = parseInt(req.params.id);
  const userId = req.user ? req.user.user_id : null;
  try {
    const status = await User.checkMembershipStatus(userId);
    const membershipStatus = status ? status.membership_status : null;
    const post = await Post.getPost(postId, membershipStatus);
    if (post) return res.json({ post });
    return res.send('The post you are looking for does not exist.')
  } catch (err) {
    return next(err);
  }
});

/** GET /posts/user/:userId - get a user's posts by user id.
 * Returns posts */
postsRouter.get("/user/:id", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id;
    const posts = await Post.getPostByUserId(parseInt(userId));
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /posts/:id - updates a specific post by post id.
 * MUST LOGGED IN AS THE AUTHOR OF POST.
 * Returns a 204 code */
postsRouter.patch("/:id", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const postId = parseInt(req.params.id);
    const currentUser = req.user;
    if (await Post.checkIsAuthor(postId, currentUser.user_id)) {
      const updateData = req.body;
      delete updateData._token;
      const lastUpdatedDate = await Post.updatePost(postId, updateData);
      return res.json(lastUpdatedDate);
    }

    throw new ExpressError("Update failed: token does not belong to the post author.", 401);
  } catch (err) {
    return next(err)
  }
});

/** DELETE /posts/:id - updates a specific post by post id.
 * MUST LOGGED IN AS THE AUTHOR OF POST.
 * Returns message */
postsRouter.delete("/:id", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const postId = parseInt(req.params.id);
    const currentUser = req.user;

    if (await Post.checkIsAuthor(postId, currentUser.user_id)) {
      const message = await Post.deletePost(postId);
      return res.json(message)
    }

    return res.status(401);
  } catch (err) {
    return next(err)
  }
});