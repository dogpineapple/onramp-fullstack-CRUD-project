import React from "react";
import CommentCard from "../CommentCard";
import { Comment } from "../custom";
import CommentForm from "../Forms/CommentForm";
import "./CommentList.css";

interface IProp {
  comments: Array<Comment>
}

function CommentList({ comments }: IProp) {
  return (
    <div className="CommentList text-left">
      <h3>Comments</h3>
      {comments.length > 0 ?
        comments.map(c => {
          return (
            <CommentCard comment={c} />
          );
        })
        : <div>No comments yet. Be the first!</div>}
      { comments.length > 0 &&
             <CommentForm postId={comments[0].post_id} commentId={undefined} isReply={false}/>}
    </div>
  );
};

export default CommentList;