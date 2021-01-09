import React from "react";
import { Card } from "react-bootstrap";
import CommentReplyCard from "../CommentReplyCard";
import { Comment } from "../custom";
import "./CommentCard.css";

interface IProp {
  comment: Comment
}

function CommentCard({ comment }:IProp) {
  return (
    <div className="CommentCard text-left">
      <Card>
        <Card.Body>
          <Card.Text>{comment.body}</Card.Text>
          <Card.Text className="text-muted">
            <span className="App-author">{comment.author_name}</span> commented {new Date(comment.created_at).toString()}
          </Card.Text>
          { comment.reply_count > 0 && <CommentReplyCard replyCount={comment.reply_count} commentId={comment.id}/>}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentCard;