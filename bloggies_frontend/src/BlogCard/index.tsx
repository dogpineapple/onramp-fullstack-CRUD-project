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

/**
 * `BlogCard` renders a card that renders:
 *  -  `post`'s data
 *  - `FavoriteButton` component
 *  - a link to the author's profile page (`UserProfile` component)
 *  - a link to the post's detail page (`PostDetails` component)
 */
function BlogCard({ post }: IProp) {
  const postTitleForURL = changeToURLFriendly(post.title);
  const authorNameForURL = changeToURLFriendly(post.author_name);

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
            <Card.Subtitle className="BlogCard-author-date">Posted by <NavLink to={`/users/${post.author_id}/${authorNameForURL}/favorites`}>{post.author_name}</NavLink> <span className="text-muted"> {moment(post.created_at).fromNow()}</span> {post.last_updated_at !== post.created_at && post.last_updated_at && <span className="App-update"> (last updated {moment(post.last_updated_at).fromNow()})</span>}</Card.Subtitle>
            <FavoriteButton post={post}></FavoriteButton>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;