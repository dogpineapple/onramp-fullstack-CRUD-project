import React from "react";
import CommentCard from "../CommentCard";
import { Comment } from "../custom";
import CommentForm from "../Forms/CommentForm";
import "./CommentList.css";

interface IProp {
  comments: Array<Comment>,
  postId: number,
  postComment: Function
}

/**
 * `CommentList` renders `CommentCard` and a `CommentForm`.
 * It displays all comments that are NOT replies (ex: comment.is_reply === false )
 */
function CommentList({ comments, postId, postComment }: IProp) {

  /** handler fxn for posting a comment (to be invoked in CommentForm (for non-replies) and CommentCard (for replies))*/
  const handlePostComment = (postId: number, commentId: number | undefined, isReply: boolean, comment: string) => {
    postComment(postId, commentId, isReply, comment);
  }

  const nonReplyComments = comments.filter(c => {
    return !c.is_reply;
  })

  return (
    <div className="CommentList text-left">
      <h3>Comments</h3>
      {nonReplyComments.length > 0 ?
        nonReplyComments.map(c => {
          return (
            <CommentCard key={c.id} comment={c} handlePostReply={handlePostComment}/>
          );
        })
        : <div className="CommentsList-no-comments">No comments yet. Be the first!</div>}
      <CommentForm postId={postId} commentId={undefined} isReply={false} handlePostComment={handlePostComment}/>
    </div>
  );
};

export default CommentList;