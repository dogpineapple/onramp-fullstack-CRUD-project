import React from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { PostFormData } from "../../custom";
import BlogForm from "../../Forms/BlogForm";
import { getCookie } from "../../helpers";
import { addPostToAPI, getUserInfoFromAPI } from "../../redux/actionCreators";
import "./ComposePage.css";

/**
 * `ComposePage` renders a `BlogForm` and handles
 * dispatch for the `addPostToAPI` action.
 * Redirects user to `Homepage` after submitting a post.
 */
function ComposePage() {
  const history = useHistory();
  const dispatch = useDispatch();

  if (!getCookie("token")) {
    return <Redirect to="/"/>
  }

  const postBlog = async (data: PostFormData) => {
     dispatch(addPostToAPI(data));
     dispatch(getUserInfoFromAPI());
    history.push("/");
  }

  return (
    <Container className="ComposePage mt-4">
      <h1>Create a new post!</h1>
      <BlogForm addPost={postBlog} post={undefined} closeModal={undefined}/>
    </Container>
  );
};

export default ComposePage;