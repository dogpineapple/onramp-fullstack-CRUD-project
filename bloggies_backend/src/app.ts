import { Request, Response, NextFunction } from "express";

const express = require("express");
const authenticateJWT = require("./auth");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(authenticateJWT);


const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const postRoutes = require("./routes/posts");
app.use("/posts", postRoutes);

const favoriteRoutes = require("./routes/favorites");
app.use("/favorites", favoriteRoutes);

const commentRoutes = require("./routes/comments");
app.use("/comments", commentRoutes)

// Global Error Handler
app.use(function(err: ExpressError, req: Request, res: Response, next: NextFunction) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
});