import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import LoginForm from "../../Forms/LoginForm";
import "./Login.css";

function Login() {
  return (
    <Container fluid className="Login">
      <div className="fade-in">
        <Row>
          <Col className="Login-title">
            <h1>Bloggies Login</h1>
          </Col>
        </Row>
        <Row className="Login-form-row">
          <LoginForm />
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