import React from "react";
import { Container, Row } from "react-bootstrap";
import BlogCard from "../BlogCard";
import { Post } from "../custom";
import "./FavoritesList.css";

interface IProp {
  favorites: Array<Post>,
  displayName: string
}

function FavoritesList({ favorites, displayName }: IProp) {
  return (
    <Container className="FavoritesList">
      <Row>
        <h3 className="mt-4">Favorites</h3>
        </Row>
        <Row>
        {favorites.length > 0 ? favorites.map((favPost: Post) => {
          return (
            <BlogCard key={favPost.id} post={favPost} />
          )
        })
        : <div>Empty... for now!</div> }
        </Row>
      </Container>
  );
};

export default FavoritesList;