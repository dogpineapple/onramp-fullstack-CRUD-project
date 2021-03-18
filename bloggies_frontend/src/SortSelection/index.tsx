import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Post } from "../custom";

interface IProp {
  posts: Array<Post>,
  handlePostSort: Function,
  currentSort: string
}

/**
 * `SortSelection` renders a dropdown that enables a user to sort
 * posts by "most recent", "most favorited", and "least favorited".
 */
function SortSelection({ posts, handlePostSort, currentSort }: IProp) {
  const DEFAULT_SORT_SELECT = "most recent";
  const [ sortType, setSortType ] = useState<string>(DEFAULT_SORT_SELECT);

  // useEffect for ensuring the current sort type will be the recently selected sort type
  // - ensures it stays the same sort type when a user causes a re-render of Homepage 
  //   (caused by the change in global state of posts from favoriting/unfavoriting)
  useEffect(() => {
    handleSelection(currentSort);
  }, [posts]);

  const handleSelection = (eventKey: string | null) => {
    let sortedPosts;
    switch (eventKey) {
      case "mostFavorite":
        setSortType("most favorited");
        sortedPosts = posts.slice().sort((a, b) => parseInt(b.bookmark_count) - parseInt(a.bookmark_count));
        handlePostSort(sortedPosts, eventKey);
        break;
      case "leastFavorite":
        setSortType("least favorited");
        sortedPosts = posts.slice().sort((a, b) => parseInt(a.bookmark_count) - parseInt(b.bookmark_count));
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