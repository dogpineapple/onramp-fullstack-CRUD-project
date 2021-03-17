import { Express, Request, Response, NextFunction } from "express";
import ExpressError from "./expressError";
import express from "express";
import cors from "cors";
import CookieParser from 'cookie-parser';
import { usersRouter} from "./routes/users";
import { authenticateJWT } from "./middleware/auth";
import { postsRouter } from "./routes/posts";
import { favoritesRouter } from "./routes/favorites";
import { commentsRouter } from "./routes/comments";
import { stripeRouter } from "./routes/stripe";
import { sendgridRouter } from "./routes/sendgrid";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
}

const app: Express = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(CookieParser());

app.use(cors(corsOptions));

app.use(authenticateJWT);

app.use("/users", usersRouter);

app.use("/posts", postsRouter);

app.use("/favorites", favoritesRouter);

app.use("/comments", commentsRouter);

app.use("/checkout", stripeRouter);

app.use("/email", sendgridRouter);

// Global Error Handler
app.use(function(err: ExpressError, req: Request, res: Response, next: NextFunction) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
});

export default app;