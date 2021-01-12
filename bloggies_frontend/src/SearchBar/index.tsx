import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button,Form } from "react-bootstrap";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getSearchResultsFromAPI } from "../redux/actionCreators";
import "./SearchBar.css";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";

/**
 * `SearchBar` renders a form for entering a search term
 * to search for posts and users matching the term.
 * Dispatches an action for `getSearchResultsFromAPI` upon submission. 
 */
function SearchBar() {
  const [ formData, setFormData ] = useState({ searchTerm: "" });
  const history = useHistory();
  const dispatch = useDispatch();
  // TODO: implement search logic 
  // need to be able to search blog posts based on title, author..
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(getSearchResultsFromAPI(formData.searchTerm));
    history.push(`/search?term=${formData.searchTerm}`);
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData(currData => ({ ...currData, [name]: value }));
  }

  return (
    <div className="SearchBar">
      <Form className="d-flex" onSubmit={handleSubmit}>
          <Form.Control name="searchTerm" value={formData.searchTerm} placeholder="Search" onChange={handleChange} required/>
          <Button type="submit"><span><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></span></Button>
      </Form>
    </div>
  );
};

export default SearchBar;