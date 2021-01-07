import { NextFunction, Response } from "express";
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
    const result = await Post.create(title, description, body, user.user_id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

