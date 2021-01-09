import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "../../BlogList";
import { getPostsFromAPI } from "../../redux/actionCreators";

function Homepage() {
  const postsList = useSelector((st: any) => st.posts);
  const dispatch = useDispatch();

  const [posts, setPosts] = useState([]);

  useEffect(function handleLoadPosts() {
    if (postsList.length === 0) {
      dispatch(getPostsFromAPI());
    }
    setPosts(postsList);
  }, [postsList]);

  return (
    <div className="Homepage">
      <Container>
        <h1 className="mt-4 text-left">recent bloggies</h1>
        <BlogList posts={posts} />
      </Container>
    </div>
  );
};

export default Homepage;