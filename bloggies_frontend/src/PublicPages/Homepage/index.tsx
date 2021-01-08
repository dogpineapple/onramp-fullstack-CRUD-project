import React, { useEffect, useState } from "react";
import BlogList from "../../BlogList";
import { BASE_URL } from "../../config";

function Homepage() {
  const [ posts , setPosts ] = useState([]); 

  useEffect(function handleGetPosts() {
    async function getPosts() {
      const res = await fetch(`${BASE_URL}/posts`);
      const postsRes = await res.json();
      setPosts(postsRes.posts);
    }
    getPosts();
  }, []);

  return (
    <div className="Homepage">
      <h1 className="mt-2">recent bloggies</h1>
      <BlogList posts={posts} />
    </div>
  );
};

export default Homepage;