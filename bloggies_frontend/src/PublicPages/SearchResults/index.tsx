import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "../../BlogList";
import { CustomReduxState } from "../../custom";
import { getSearchResultsFromAPI } from "../../redux/actionCreators";
import UserList from "../../UserList";

function SearchResults() {
  const postsResults = useSelector((st: CustomReduxState) => st.searchResults.posts);
  const usersResults = useSelector((st: CustomReduxState) => st.searchResults.users);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const dispatch = useDispatch();

  // get the query value for "term" to display or 
  // search backend if user has altered url instead of using search bar.
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const searchTerm = params.get("term");
  
  useEffect(function handleSearch() {
    if (!isSearched) {
      if (searchTerm) {
        dispatch(getSearchResultsFromAPI(searchTerm));
      }
      setIsSearched(true);
    }
  }, []);

  return (
    <Container className="SearchResults text-left">
      <h1 className="mt-3">Search results for '{searchTerm}'</h1>
      <Row className="mt-5">
        <Col md={8}>
          <h3>Posts results</h3>
          <BlogList posts={postsResults} />
        </Col>
        <Col md={4}>
          <h3>Users results</h3>
          <UserList users={usersResults} />
        </Col>
      </Row>
    </Container>
  );
};

export default SearchResults;