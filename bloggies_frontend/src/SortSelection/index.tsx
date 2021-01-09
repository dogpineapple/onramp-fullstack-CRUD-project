import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Post } from "../custom";

interface IProp {
  posts: Array<Post>,
  handlePostSort: Function
}

function SortSelection({ posts, handlePostSort }: IProp) {
  const DEFAULT_SORT_SELECT = "most recent";
  const [ sortType, setSortType ] = useState<string>(DEFAULT_SORT_SELECT);

  const handleSelection = (eventKey: string | null) => {
    let sortedPosts = posts;
    switch (eventKey) {
      case "mostFavorite":
        setSortType("most favorited");
        sortedPosts = posts.sort((a, b) => b.favorite_count - a.favorite_count);
        break;
      case "leastFavorite":
        setSortType("least favorited");
        sortedPosts = posts.sort((a, b) => a.favorite_count - b.favorite_count);

        break;
      case "mostRecent":
        setSortType(DEFAULT_SORT_SELECT);
        sortedPosts = posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        setSortType(DEFAULT_SORT_SELECT);
        break;
    }
    handlePostSort(sortedPosts, sortType);
  }

  return (
    <div className="SortSelection">
      <Dropdown>
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