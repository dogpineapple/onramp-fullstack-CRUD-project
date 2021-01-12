import React, { useState } from "react";
import { Accordion, Card, Button, AccordionCollapse } from "react-bootstrap";
import { BASE_URL } from "../config";
import { Comment } from "../custom";
import CommentCard from "../CommentCard";
interface IProp {
  replyCount: string,
  commentId: number
}

/**
 * `CommentReplyAccord` renders an Accordion to display a list of replies
 * to a comment.
 * - A GET request is invoked when user clicks to toggle open the Accordian.
 */
function CommentReplyAccord({ replyCount, commentId }: IProp) {
  const [replies, setReplies] = useState<Array<Comment>>([]);

  // GET request for a comment's replies. 
  const getReplies = async () => {
    const res = await fetch(`${BASE_URL}/comments/${commentId}/replies`);
    const repliesData = await res.json();
    setReplies(repliesData.replies);
  }

  return (
    <div className="CommentReplyAccord mt-3">
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={commentId.toString()} onClick={getReplies}>
              View {replyCount} {parseInt(replyCount) > 1 ? "replies" : "reply"}
            </Accordion.Toggle>
          </Card.Header>
          <AccordionCollapse eventKey={commentId.toString()}>
            <Card.Body>
              {replies.length > 0 ?
                replies.map(r => {
                  return (
                    <CommentCard key={r.id} comment={r} handlePostReply={undefined}/>
                  );
                })
                : "Fetching replies.."}
            </Card.Body>
          </AccordionCollapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default CommentReplyAccord;