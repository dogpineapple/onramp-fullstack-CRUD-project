import moment from "moment";
import React from "react";
import { Card, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Post } from "../custom";
import { changeToURLFriendly } from "../helpers";
import FavoriteButton from "../FavoriteButton";
import "./BlogCard.css";
import styled from "styled-components";
import { PREMIUM_COLOR, DEFAULT_COLOR } from "../theme";

interface IProp {
  post: Post
}

interface IStyledProp {
  isPremium?: boolean;
}

const StyledBlogLink = styled(({ isPremium, ...rest }) => <NavLink {...rest} />) <IStyledProp>`
    color: ${({ isPremium }) => isPremium ? PREMIUM_COLOR.linkText : DEFAULT_COLOR.linkText};
    &:visited {
      color: ${({ isPremium }) => isPremium ? PREMIUM_COLOR.linkText : DEFAULT_COLOR.linkText};
    }
    &:hover {
      color: ${({ isPremium }) => isPremium ? PREMIUM_COLOR.linkHoverText : DEFAULT_COLOR.linkHoverText};
      text-decoration: none;
    }
  `

const StyledAuthorLink = styled(NavLink)`
    color: ${DEFAULT_COLOR.authorNameBlogCardText};
    &:visited {
      color: ${DEFAULT_COLOR.authorNameBlogCardText};
    }
    &:hover {
      color: ${DEFAULT_COLOR.authorNameBlogCardText};
    }
  `

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
        <StyledBlogLink isPremium={post.is_premium} to={`/blogs/${post.id}/${postTitleForURL}`}>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle>{post.description}</Card.Subtitle>
          <Card.Text className="BlogCard-body">
            {post.body}
          </Card.Text>
        </StyledBlogLink>
        <Container fluid>
          <Row className="d-flex align-items-baseline justify-content-between">
            <Card.Subtitle className="BlogCard-author-date d-flex align-items-center">Posted by <StyledAuthorLink className="d-flex align-items-center ml-1 mr-1" to={`/users/${post.author_id}/${authorNameForURL}`}>
              {post.author_name}
            </StyledAuthorLink>
              <span className="text-muted"> {moment(post.created_at).fromNow()}</span> {post.last_updated_at !== post.created_at && post.last_updated_at && <span className="App-update"> (last updated {moment(post.last_updated_at).fromNow()})</span>}</Card.Subtitle>
            <FavoriteButton post={post}></FavoriteButton>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;
