import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "../../BlogList";
import { Post } from "../../custom";
import { getPostsFromAPI } from "../../redux/actionCreators";
import SortSelection from "../../SortSelection";

function Homepage() {
  const postsList = useSelector((st: any) => st.posts);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [sortType, setSortType] = useState("mostRecent")

  useEffect(function handleLoadPosts() {
    if (postsList.length === 0) {
      dispatch(getPostsFromAPI());
    } else {
      setPosts(postsList);
    }
    console.log("changing the posts..", postsList);
  }, [postsList]);

  const handlePostSort = (sortedPosts: Array<Post>, sortType: string) => {
    setPosts(sortedPosts);
    console.log("changing ..")
    setSortType(sortType)
  }

  return (
    <div className="Homepage">
      <Container>
        <h1 className="mt-4 text-left">recent bloggies</h1>
        <SortSelection handlePostSort={handlePostSort} posts={postsList} />
        <BlogList key={sortType} posts={posts} />
      </Container>
    </div>
  );
};

export default Homepage;