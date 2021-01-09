import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button,Form } from "react-bootstrap";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";

function SearchBar() {
  // TODO: implement search logic 
  // need to be able to search blog posts based on title, author.. 
  return (
    <div className="SearchBar">
      <Form className="d-flex">
          <Form.Control placeholder="Search" />
          <Button type="submit"><span><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></span></Button>
      </Form>
    </div>
  );
};

export default SearchBar;