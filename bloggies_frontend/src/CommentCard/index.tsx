import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import moment from "moment";
import CommentReplyCard from "../CommentReplyCard";
import { Comment } from "../custom";
import "./CommentCard.css";
import CommentForm from "../Forms/CommentForm";

interface IProp {
  comment: Comment
}

function CommentCard({ comment }: IProp) {
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  return (
    <div className="CommentCard text-left">
      <Card>
        <Card.Body>
          <Card.Text>{comment.body}</Card.Text>
          <Card.Text className="text-muted d-flex justify-content-between">
            <div>
              <span className="App-author">{comment.author_name}</span> commented {moment(comment.created_at).fromNow()}
            </div>
            <Button onClick={() => setShowCommentForm(!showCommentForm)}>{showCommentForm ? "Cancel" : "Reply"}</Button>
          </Card.Text>
            {showCommentForm && <CommentForm postId={comment.post_id} commentId={comment.id} isReply={true} handlePostComment={(postId: number, commentId: undefined, isReply: false) => console.log("posting the comment")}/>}
          {comment.reply_count > 0 && <CommentReplyCard replyCount={comment.reply_count} commentId={comment.id} />}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentCard;