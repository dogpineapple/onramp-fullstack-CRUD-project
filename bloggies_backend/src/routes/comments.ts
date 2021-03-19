import { NextFunction, Request, Response } from "express";
import express from "express";
import Comment from "../models/comment";

export const commentsRouter = express.Router();

/** GET /comments/:postId - retrieve bookmarked posts for a user.
 * Returns a list of comments */
commentsRouter.get("/:postId", async function (req: Request, res: Response, next: NextFunction) {
  const postId = parseInt(req.params.postId);
  try {
    const comments = await Comment.getCommentsByPostId(postId);
    return res.json(comments);
  } catch (err) {
    return next(err);
  }
});

/** GET /comments/:commentId/replies - retrieve replies for a comment by comment id.
 * Returns a list of replies */
commentsRouter.get("/:commentId/replies", async function (req: Request, res: Response, next: NextFunction) {
  const commentId = parseInt(req.params.commentId);
  try {
    const replies = await Comment.getRepliesByCommentId(commentId);
    return res.json(replies);
  } catch (err) {
    return next(err);
  }
});

/** POST /comments - add a new comment.
 * Returns a comment */
commentsRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { body, post_id, author_id, is_reply, reply_to_comment_id } = req.body;
    const comment = await Comment.createComment(body, post_id, author_id, is_reply);
    if (is_reply) {
      await Comment.createReply(comment.id, reply_to_comment_id)
    }
    return res.status(201).json(comment);
  } catch (err) {
    return next(err);
  }
});