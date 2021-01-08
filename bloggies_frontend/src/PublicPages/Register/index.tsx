import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import SignUpForm from '../../Forms/SignUpForm';
import './Register.css';

function Register() {
  return (
    <div className="Register">
      <Container fluid className="Register-hero-container">
        <Row className="d-flex justify-content-around align-items-center">
          <Col sm={12} md={5} className="Register-hero-text">
            <p className="Register-hero-title fade-in-left">
              <p>hosting blog posts since 2021</p>
              <p className="Register-title-text">bloggies</p>
            </p>
            <p className="Register-hero-desc fade-in-left-late">Come join the (not-yet-but-soon) coolest blog site!</p>
            <p className="Register-hero-desc fade-in-left-late">
              See what others are posting!
            </p>
            <NavLink to="/blogs">
              <Button className="fade-in-left-late">Bring me to the blogs</Button>
            </NavLink>
          </Col>
          <Col sm={12} md={5} className="fade-in">
            <h1>Ready to join Bloggies?</h1>
            <SignUpForm />
          </Col>
        </Row>
      </Container>

    </div>
  )
}

export default Register;