import React from "react";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
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
      <Card.Subtitle>Posted by {post.author_name} <span className="text-muted">- on {post.created_at}</span></Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;