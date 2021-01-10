import React from "react";
import { Container } from "react-bootstrap";
import { Redirect, useHistory } from "react-router";
import { BASE_URL } from "../../config";
import { PostFormData } from "../../custom";
import BlogForm from "../../Forms/BlogForm";


function ComposePage() {
  const history = useHistory();

  if (!localStorage.getItem("token")) {
    return <Redirect to="/"/>
  }

  const postBlog = async (data: PostFormData) => {
    const _token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      body: JSON.stringify({ ...data, _token }),
      headers: {
        "Content-type": "application/json"
      }
    });
    const resData = await res.json();
    if (res.status === 201) {
      history.push("/");
    } else {
      console.log("error in posting", resData.error.message);
    }
  }

  return (
    <Container className="ComposePage mt-4">
      <h1>Create a new post!</h1>
      <BlogForm addPost={postBlog} post={undefined} closeModal={undefined}/>
    </Container>
  );
};

export default ComposePage;