import React from "react";
import { Redirect, Route, Switch } from "react-router";
import Login from "../RoutedPages/Login";
import Homepage from "../RoutedPages/Homepage";
import Register from "../RoutedPages/Register";
import "./PublicRoutes.css";
import PostDetails from "../RoutedPages/PostDetails";
import UserProfile from "../RoutedPages/UserProfile";
import ComposePage from "../RoutedPages/ComposePage";
import SearchResults from "../RoutedPages/SearchResults";

function PublicRoutes() {
  return (
    <Switch>
      <Route exact path="/users/:userId/:displayName/favorites">
        <div className="PublicRoutes-thin-container">
          <UserProfile />
        </div>
      </Route>
      <Route exact path="/blogs/:postId/:postTitle">
        <div className="PublicRoutes-thin-container">
          <PostDetails />
        </div>
      </Route>
      <Route exact path="/search">
        <SearchResults />
      </Route>
      <Route exact path="/blogs/create">
        <div className="PublicRoutes-thin-container">
          <ComposePage />
        </div>
      </Route>
      <Route exact path="/users/login">
        <Login />
      </Route>
      <Route exact path="/users/register">
        <Register />
      </Route>
      <Route exact path="/">
        <div className="PublicRoutes-thin-container">
          <Homepage />
        </div>
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}

export default PublicRoutes;