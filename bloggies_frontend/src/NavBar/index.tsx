import { faBlog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { CustomReduxState } from "../custom";
import { changeToURLFriendly } from "../helpers";
import { logoutUser } from "../redux/actionCreators";
import SearchBar from "../SearchBar";
import "./NavBar.css";

/**
 * `NavBar` renders a navigation bar that (depending on login status) directs to:
 *  - `ComposeBlog` component
 *  - `UserProfile` component
 *  - `Homepage` component
 *  - `Login` component
 *  - `Register` component
 *  - Invoke `handleLogout()` that dispatches a `logoutUser()` action creator.
 */
function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((st: CustomReduxState) => st.user);
  const urlDisplayName = changeToURLFriendly(user.display_name || "");
  const history = useHistory();

  // To logout a user, call the logoutUser() action and clear localStorage to remove token.
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logoutUser());
    history.push("/");
  }

  return (
    <Navbar className="NavBar" variant="dark" expand="lg">
      <NavLink to="/">
        <span className="NavBar-title"><FontAwesomeIcon icon={faBlog}/> bloggies.</span>
      </NavLink>
      <SearchBar />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto NavBar-list">
          <NavLink exact to="/">newsfeed</NavLink>
          {user.id ?
            <Fragment>
              <NavLink exact to={`/blogs/create`}>compose blog</NavLink>
              <NavLink exact to={`/users/${user.id}/${urlDisplayName}/favorites`}>my profile</NavLink>
              <Button variant="danger" className="NavBar-logout-btn" onClick={handleLogout}>logout</Button>
            </Fragment>
            : <Fragment>
              <NavLink exact to="/users/login">login</NavLink>
              <NavLink exact to="/users/register">sign up</NavLink>
            </Fragment>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;