import React from "react";
import { Route, Switch } from "react-router";
import NavBar from "../NavBar";
import Homepage from "../PublicPages/Homepage";
import Login from "../PublicPages/Login";
import Register from "../PublicPages/Register";

function PublicRoutes() {
  return (
    <div className="PublicRoutes">
      <NavBar/>
      <Switch>
        <Route exact path="/users/login">
          <Login/>
        </Route>
        <Route exact path="/users/register">
          <Register />
        </Route>
        <Route exact path="/">
          <Homepage />
        </Route>
      </Switch>
    </div>
  )
}

export default PublicRoutes;