import moment from "moment";
import React from "react";
import { Card, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import FavoriteButton from "../FavoriteButton";
import "./BlogCard.css";

interface IProp {
  post: any
}

function BlogCard({ post }: IProp) {
  const postTitleForURL = post.title.replaceAll(" ", "-").toLowerCase();

  return (
    <Card className="BlogCard text-left">
      <Card.Body>
        <NavLink to={`/blog/${post.id}/${postTitleForURL}`}>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle>{post.description}</Card.Subtitle>
          <Card.Text className="BlogCard-body">
            {post.body}
          </Card.Text>
        </NavLink>
        <Container fluid>
          <Row className="d-flex align-items-baseline justify-content-between">
            <Card.Subtitle className="BlogCard-author-date">Posted by {post.author_name} <span className="text-muted"> {moment(post.created_at).fromNow()}</span></Card.Subtitle>
            <FavoriteButton post={post}></FavoriteButton>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;