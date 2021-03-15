import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import moment from "moment";
import CommentReplyAccord from "../CommentReplyAccord";
import { Comment } from "../custom";
import "./CommentCard.css";
import CommentForm from "../Forms/CommentForm";
import UserProfilePhoto from "../UserProfilePhoto";
import { useHistory } from "react-router";
import { changeToURLFriendly } from "./../helpers";

interface IProp {
  comment: Comment,
  handlePostReply: Function | undefined
}

/** 
 * `CommentCard` renders a Comment object as a Card UI item.
 * - invokes handlePostReply once a submit occurs in `CommentForm` (allowing for commenting replies)
 * - displays an option to toggle `CommentForm` if the Comment is not a reply comment.
 * - displays `CommentReplyAccord` if a Comment has at least 1 reply comment.
 */
function CommentCard({ comment, handlePostReply }: IProp) {
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [replyCount, setReplyCount] = useState<number>(0);
  const history = useHistory();

  useEffect(() => {
    setReplyCount(parseInt(comment.reply_count));
  }, []);

  /** Passes the data needed for a new comment to the parent component's function. */
  const postReply = (postId: number, commentId: undefined, isReply: boolean, body: string) => {
    if (handlePostReply) {
      handlePostReply(postId, commentId, isReply, body);
      setShowCommentForm(false);
    }

    // if the comment is a reply to another comment, increment the `replyCount` state.
    // this will cause the `CommentReplyAccord` to re-render due to the replyCount passed as a `key` property.
    if (isReply) {
      setReplyCount(replyCount + 1);
    }
  }

  const redirectToProfile = () => {
    // go to their profile
    history.push(`/users/${comment.author_id}/${changeToURLFriendly(comment.author_name)}`);
  }

  return (
    <div className="CommentCard text-left">
      <Card>
        <Card.Body>
          <Card.Text>{comment.body}</Card.Text>
          <div className="text-muted d-flex justify-content-between">
            <span className="d-flex flex-row align-items-center">
              <UserProfilePhoto username={comment.author_name} photoUrl={comment.author_photo} handlePhotoClick={redirectToProfile} width="2rem" />
              <span className="App-author ml-2 mr-1">{comment.author_name}</span>
              commented {moment(comment.created_at).fromNow()}
            </span>
            {/* Only show 'Reply' button if the comment is not a reply comment. */}
            {!comment.is_reply && <Button onClick={() => setShowCommentForm(!showCommentForm)}>{showCommentForm ? "Cancel" : "Reply"}</Button>}
          </div>
          {/* Show `CommentForm` if showCommentForm is true */}
          {showCommentForm && <CommentForm postId={comment.post_id} commentId={comment.id} isReply={true} handlePostComment={postReply} />}
          {/* If a comment has replies, show a collapsible of the comment's replies */}
          {replyCount > 0 && <CommentReplyAccord key={replyCount} replyCount={replyCount.toString()} commentId={comment.id} />}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentCard;