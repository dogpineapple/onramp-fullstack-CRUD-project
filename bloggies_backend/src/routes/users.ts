import { NextFunction, Request, Response } from "express";
import { ensureLoggedIn } from "../auth";

const express = require("express");

const router = new express.Router();

/** POST /users/register - creates a new user. 
 * Returns user object & jwt */
router.post("/register", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, display_name } = req.body;
    const result = await User.register(username, password, display_name);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /users/login - authenticate credentials and login a user. 
 * Returns user object & jwt*/
router.post("/login", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const result = await User.authenticate(username, password);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

/** GET /users/:id - gets a specific user by user id.
 * Return a user object */
router.get("/:id", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const user = await User.getUser(parseInt(req.params.id));
  return res.json({ user })
});