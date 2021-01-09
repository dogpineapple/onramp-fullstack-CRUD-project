import React from "react";
import CommentCard from "../CommentCard";
import { Comment } from "../custom";
import CommentForm from "../Forms/CommentForm";
import "./CommentList.css";

interface IProp {
  comments: Array<Comment>,
  postId: number
}

function CommentList({ comments, postId }: IProp) {
  return (
    <div className="CommentList text-left">
      <h3>Comments</h3>
      {comments.length > 0 ?
        comments.map(c => {
          return (
            <CommentCard comment={c} />
          );
        })
        : <div className="CommentsList-no-comments">No comments yet. Be the first!</div>}
      <CommentForm postId={postId} commentId={undefined} isReply={false} />
    </div>
  );
};

export default CommentList;