import { faBlog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeToURLFriendly } from "../helpers";
import { logoutUser } from "../redux/actionCreators";
import SearchBar from "../SearchBar";
import "./NavBar.css";

function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((st: any) => st.user);
  const urlDisplayName = changeToURLFriendly(user.display_name);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logoutUser());
  }

  return (
    <Navbar className="NavBar" variant="dark" expand="lg">
      <Nav.Link href="/">
        <span className="NavBar-title"><FontAwesomeIcon icon={faBlog}/> bloggies.</span>
      </Nav.Link>
      <SearchBar />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto NavBar-list">
          <Nav.Link href="/">newsfeed</Nav.Link>
          {user.id ?
            <Fragment>
              <Nav.Link href={`/blogs/create`}>compose blog</Nav.Link>
              <Nav.Link href={`/users/${user.id}/${urlDisplayName}/favorites`}>my favorites</Nav.Link>
              <Button variant="danger" className="NavBar-logout-btn" onClick={handleLogout}>logout</Button>
            </Fragment>
            : <Fragment>
              <Nav.Link href="/users/login">login</Nav.Link>
              <Nav.Link href="/users/register">sign up</Nav.Link>
            </Fragment>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;