import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Post } from "../custom";

interface IProp {
  posts: Array<Post>,
  handlePostSort: Function
}

/**
 * `SortSelection` renders a dropdown that enables a user to sort
 * posts by "most recent", "most favorited", and "least favorited".
 */
function SortSelection({ posts, handlePostSort }: IProp) {
  const DEFAULT_SORT_SELECT = "most recent";
  const [ sortType, setSortType ] = useState<string>(DEFAULT_SORT_SELECT);

  const handleSelection = (eventKey: string | null) => {
    let sortedPosts;
    switch (eventKey) {
      case "mostFavorite":
        setSortType("most favorited");
        sortedPosts = posts.slice().sort((a, b) => parseInt(b.favorite_count) - parseInt(a.favorite_count));
        handlePostSort(sortedPosts, eventKey);
        break;
      case "leastFavorite":
        setSortType("least favorited");
        sortedPosts = posts.slice().sort((a, b) => parseInt(a.favorite_count) - parseInt(b.favorite_count));
        handlePostSort(sortedPosts, eventKey);
        break;
      case "mostRecent":
        setSortType(DEFAULT_SORT_SELECT);
        sortedPosts = posts.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        handlePostSort(sortedPosts, eventKey);
        break;
      default:
        setSortType(DEFAULT_SORT_SELECT);
        handlePostSort(posts, eventKey);
        break;
    }
  }

  return (
    <div className="SortSelection d-flex align-items-center">
      View by:
      <Dropdown className="ml-2">
        <Dropdown.Toggle variant="primary" id="filter-dropdown">
          {sortType}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="mostRecent" onSelect={handleSelection} >most recent</Dropdown.Item>
          <Dropdown.Item eventKey="mostFavorite" onSelect={handleSelection} >most favorited</Dropdown.Item>
          <Dropdown.Item eventKey="leastFavorite" onSelect={handleSelection} >least favorited</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default SortSelection;