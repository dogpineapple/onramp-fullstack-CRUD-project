import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import CommentCard from "../CommentCard";
import { Comment } from "../custom";
import "./CommentList.css";

interface IProp {
  comments: Array<Comment>
}

function CommentList({ comments }: IProp) {
  return (
    <Container className="CommentList">
      <Row>
        <Col className="text-left">
          <h3>Comments</h3>
        </Col>
      </Row>
      <Row>
        {comments.length > 0 ?
          comments.map(c => {
            return (
              <Col key={c.id} md={12}>
                <CommentCard comment={c} />
              </Col>
            );
          })
          : <Col md={12}>No comments yet. Be the first!</Col>}
      </Row>
    </Container>
  );
};

export default CommentList;