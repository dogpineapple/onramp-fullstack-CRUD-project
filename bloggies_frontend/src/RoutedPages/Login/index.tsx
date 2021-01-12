import React, { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { BASE_URL } from "../../config";
import LoginForm from "../../Forms/LoginForm";
import { getUserFavoritesFromAPI, gotUserInfo } from "../../redux/actionCreators";
import "./Login.css";

interface LoginFormData {
  username: string,
  password: string
}

/**
 * `Login` renders a page for the `LoginForm` and creates a 
 * POST request to login a user on `LoginForm` submit. 
 *  - Dispatches `gotUserInfo` and `getUserFavoritesFromAPI` to update redux store.
 *  - Displays serverErr if any errors from logging in.
 */
function Login() {
  const [ serverErr, setServerErr ] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  const loginUser = async (loginData: LoginFormData) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-type": "application/json"
      }
    });
    const loginRes = await res.json();
    // set the user's token into the localStorage.
    localStorage.setItem("token", loginRes.token);
    
    if (res.status === 200) {
      dispatch(gotUserInfo(loginRes.user));
      dispatch(getUserFavoritesFromAPI(loginRes.user.id));
      history.push("/");
    } else {
      setServerErr(loginRes.error.message);
    }
  }

  return (
    <Container fluid className="Login">
      <div className="fade-in">
        <Row>
          <Col className="Login-title">
            <h1>Bloggies Login</h1>
          </Col>
        </Row>
        <Row className="Login-form-row">
          { serverErr && <Alert variant="danger" className="m-auto">{serverErr}</Alert> }
          <LoginForm loginUser={loginUser}/>
        </Row>
        <Row className="mt-3">
          <Col>
            <p className="Login-not-user">Not registered? <NavLink to="/users/register">Click here to sign up!</NavLink></p>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Login;