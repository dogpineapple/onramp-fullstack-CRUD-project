import React from "react";
import { Container, Row } from "react-bootstrap";
import BlogCard from "../BlogCard";
import { Post } from "../custom";

interface IProp {
  favorites: Array<Post>
}

/**
 * `FavoritesList` renders `BlogCard`s for each favorited post.
 * - If no favorited posts, it will render "Empty... for now!"
 */
function FavoritesList({ favorites }: IProp) {
  return (
    <Container className="FavoritesList">
      <Row>
        <h3 className="mt-4">Favorites</h3>
        </Row>
        <Row>
        {favorites.length > 0 ? favorites.map((favPost: Post) => {
          return (
            <BlogCard key={favPost.id} post={favPost} />
          );
        })
        : <div>Empty... for now!</div> }
        </Row>
      </Container>
  );
};

export default FavoritesList;