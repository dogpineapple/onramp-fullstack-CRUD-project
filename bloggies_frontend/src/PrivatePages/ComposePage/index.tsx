import React from "react";
import { BASE_URL } from "../../config";
import { PostFormData } from "../../custom";
import NewBlogForm from "../../Forms/NewBlogForm";


function ComposePage() {

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
      console.log("successfully posted");
    } else {
      console.log("error in posting", resData.error.message);
    }
  }

  return (
    <div className="ComposePage">
      <h1>Create a new post!</h1>
      <NewBlogForm postBlog={postBlog}/>
    </div>
  );
};

export default ComposePage;