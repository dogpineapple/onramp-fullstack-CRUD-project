import moment from "moment";
import React from "react";
import { Card, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Post } from "../custom";
import { changeToURLFriendly } from "../helpers";
import FavoriteButton from "../FavoriteButton";
import "./BlogCard.css";

interface IProp {
  post: Post
}

function BlogCard({ post }: IProp) {
  const postTitleForURL = changeToURLFriendly(post.title);

  return (
    <Card className="BlogCard text-left">
      <Card.Body>
        <NavLink to={`/blogs/${post.id}/${postTitleForURL}`}>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle>{post.description}</Card.Subtitle>
          <Card.Text className="BlogCard-body">
            {post.body}
          </Card.Text>
        </NavLink>
        <Container fluid>
          <Row className="d-flex align-items-baseline justify-content-between">
            <Card.Subtitle className="BlogCard-author-date">Posted by {post.author_name} <span className="text-muted"> {moment(post.created_at).fromNow()}</span> {post.last_updated_at !== post.created_at && <span className="App-update"> (last updated {moment(post.last_updated_at).fromNow()})</span>}</Card.Subtitle>
            <FavoriteButton post={post}></FavoriteButton>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;