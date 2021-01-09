import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "../../BlogList";
import { getPostsFromAPI } from "../../redux/actionCreators";

function Homepage() {
  const postsList = useSelector((st: any) => st.posts);
  const dispatch = useDispatch();

  const [ posts , setPosts ] = useState([]); 

  useEffect(function handleLoadPosts() {
    if (postsList.length === 0) {
      dispatch(getPostsFromAPI());
    }
    setPosts(postsList);
  }, [postsList]);

  return (
    <div className="Homepage">
      <h1 className="mt-2 text-center">recent bloggies</h1>
      <BlogList posts={posts} />
    </div>
  );
};

export default Homepage;