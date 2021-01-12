import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "../../BlogList";
import { CustomReduxState, Post } from "../../custom";
import { getPostsFromAPI } from "../../redux/actionCreators";
import SortSelection from "../../SortSelection";

/**
 * `Homepage` renders `BlogList` and `SortSelection` components.
 * If posts do not exist in current redux store, it dispatches an action to
 * `getPostsFromAPI`.
 */
function Homepage() {
  const postsList = useSelector((st: CustomReduxState) => st.posts.sort((a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [sortType, setSortType] = useState("mostRecent")

  useEffect(function handleLoadPosts() {
    if (postsList.length === 0) {
      dispatch(getPostsFromAPI());
    } else {
      setPosts(postsList);
    }
  }, [postsList]);

  // invoked in `SortSelection` component when a user chooses a sort type in the dropdown.
  const handlePostSort = (sortedPosts: Array<Post>, newSortType: string) => {
    setPosts(sortedPosts);
    setSortType(newSortType);
  }

  return (
    <div className="Homepage">
      <Container>
        <Row className="mt-4">
          <Col md={12} className="d-flex align-items-center justify-content-between">
            <h1 className="text-left">Bloggies newsfeed</h1>
            <SortSelection handlePostSort={handlePostSort} posts={postsList} />
          </Col>
        </Row>
        <BlogList key={sortType} posts={posts} />
      </Container>
    </div>
  );
};

export default Homepage;