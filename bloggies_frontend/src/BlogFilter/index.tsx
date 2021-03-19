import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Post } from "../custom";

interface IProp {
  posts: Post[];
  handlePostFilter: Function;
}

function BlogFilter({ posts, handlePostFilter }: IProp) {
  const DEFAULT_FILTER_SELECT = "all";
  const [ filterType, setfilterType ] = useState<string>(DEFAULT_FILTER_SELECT);

  const handleSelection = (eventKey: string | null) => {
    let filteredPosts: Post[] = [];
    switch (eventKey) {
      case "premium":
        setfilterType("premium");
        filteredPosts = posts.filter(p => {
          return p.is_premium;
        });
        break;
      case "free":
        setfilterType("free");
        filteredPosts = posts.filter(p => {
          return !p.is_premium;
        });
        break;
      default:
        setfilterType(DEFAULT_FILTER_SELECT);
        break;
    };
    handlePostFilter(filteredPosts, eventKey);
  };

  return (
    <div className="BlogFilter pt-1 d-flex align-items-center">
      Filter:
      <Dropdown className="ml-2">
        <Dropdown.Toggle variant="primary" id="filter-dropdown">
          {filterType}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="all" onSelect={handleSelection} >all posts</Dropdown.Item>
          <Dropdown.Item eventKey="premium" onSelect={handleSelection} >premium posts</Dropdown.Item>
          <Dropdown.Item eventKey="free" onSelect={handleSelection} >free posts</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default BlogFilter;