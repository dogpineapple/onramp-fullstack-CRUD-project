import React from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { PostFormData } from "../../custom";
import BlogForm from "../../Forms/BlogForm";
import { addPostToAPI } from "../../redux/actionCreators";
import "./ComposePage.css";


function ComposePage() {
  const history = useHistory();
  const dispatch = useDispatch();

  if (!localStorage.getItem("token")) {
    return <Redirect to="/"/>
  }

  const postBlog = async (data: PostFormData) => {
    dispatch(addPostToAPI(data));
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