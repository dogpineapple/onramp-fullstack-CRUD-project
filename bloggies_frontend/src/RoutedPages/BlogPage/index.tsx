import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BlogFilter from "../../BlogFilter";
import BlogList from "../../BlogList";
import { CustomReduxState, Post } from "../../custom";
import { getMembershipStatus, getPostsFromAPI } from "../../redux/actionCreators";
import SortSelection from "../../SortSelection";
/**
 * `BlogPage` renders `BlogList` and `SortSelection` components.
 * If posts do not exist in current redux store, it dispatches an action to
 * `getPostsFromAPI`.
 */
function BlogPage() {
  const postsList = useSelector((st: CustomReduxState) => st.posts.sort((a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  const currentUser = useSelector((st: CustomReduxState) => st.user);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [sortType, setSortType] = useState("mostRecent")

  useEffect(function handleLoadPosts() {
    // Fetch for updated membership status if logged in (FE handles UI theme btwn un/paid)
    if (currentUser.id) {
      dispatch(getMembershipStatus(currentUser.id));
    }

    // Fetch for posts if no posts are saved. (BE handles types of post to display)
    dispatch(getPostsFromAPI());
    setPosts(postsList);
  }, []);

  // invoked in `SortSelection` component when a user chooses a sort type in the dropdown.
  const handlePostSort = (sortedPosts: Array<Post>, newSortType: string) => {
    setPosts(sortedPosts);
    setSortType(newSortType);
  }

  const handlePostFilter = (filteredPosts: Array<Post>, newFilterType: string) => {
    if (newFilterType !== "all") {
      setPosts(filteredPosts);
    } else {
      setPosts(postsList);
    }
  }

  return (
    <div className="BlogPage">
      <Container>
        <Row className="mt-4 d-flex align-items-center justify-content-between">
          <Col md={6}>
            <h1 className="text-left">Bloggies newsfeed</h1>
          </Col>
          <Col md={3}>
            <SortSelection handlePostSort={handlePostSort} posts={postsList} currentSort={sortType} />
          </Col>
          <Col md={3}>
            {currentUser.membership_status === "active" && <BlogFilter posts={postsList} handlePostFilter={handlePostFilter} />}
          </Col>
        </Row>
        <BlogList key={sortType} posts={posts} />
      </Container>
    </div>
  );
};

export default BlogPage;