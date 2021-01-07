import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../auth";
import { IUserRequest } from "../interfaces";

const express = require("express");

const router = new express.Router();

/** POST /posts - creates a new post. 
 * Returns post object */
router.post("/", ensureLoggedIn, async function (req: IUserRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { title, description, body } = req.body;
    const post = await Post.create(title, description, body, user.user_id);
    return res.status(201).send({ post });
  } catch (err) {
    return next(err);
  }
});

/** GET /posts - get all posts. 
 * Returns posts */
router.get("/", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await Post.getAll();
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

/** GET /posts/:id - get a specific post by post id. 
 * Returns posts */
router.get("/:id", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const postId = req.params.id;
    const post = await Post.getPost(parseInt(postId));
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /posts/:id - updates a specific post by post id. 
 * MUST LOGGED IN AS THE AUTHOR OF POST.
 * Returns a 204 code */
router.patch("/:id", ensureLoggedIn, async function(req: IUserRequest, res: Response, next: NextFunction) {
  try {
    const postId = parseInt(req.params.id);
    const currentUser = req.user

    if (await Post.isAuthor(postId, currentUser.user_id)) {
      const updateData = req.body;
      await Post.update(postId, updateData);
      return res.status(204);
    }

    return res.status(401);
  } catch (err) {
    return next(err)
  }
});

/** DELETE /posts/:id - updates a specific post by post id. 
 * MUST LOGGED IN AS THE AUTHOR OF POST.
 * Returns message */
router.delete("/:id", ensureLoggedIn, async function(req: IUserRequest, res: Response, next: NextFunction) {
  try {
    const postId = parseInt(req.params.id);
    const currentUser = req.user;

    if (await Post.isAuthor(postId, currentUser.user_id)) {
      const message = await Post.delete(postId);
      return res.json(message)
    }

    return res.status(401);
  } catch (err) {
    return next(err)
  }
});

/** SEARCH /posts/search?term=[term] - get all posts. 
 * Returns posts */
router.get("/search", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const term = req.query.term;
    // TODO: search method
    const posts = await Post.search(term);
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});
