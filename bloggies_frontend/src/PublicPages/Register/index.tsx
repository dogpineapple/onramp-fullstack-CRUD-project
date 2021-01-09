import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { BASE_URL } from '../../config';
import SignUpForm from '../../Forms/SignUpForm';
import { gotUserInfo } from '../../redux/actionCreators';
import './Register.css';

interface SignUpFormData {
  username: string,
  password: string, 
  repeatPassword: string,
  display_name: string 
}

function Register() {
  const dispatch = useDispatch();
  const [serverErr, setServerErr] = useState("");
  const history = useHistory();

  const signUp = async (data: SignUpFormData) => {
    setServerErr("");
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json"
      }
    });
    const userRes = await res.json();
    // set the user's token into the localStorage.
    localStorage.setItem("token", userRes.token);
    
    if (res.status === 201) {
      dispatch(gotUserInfo(userRes.user));
      history.push("/");
    } else if (res.status === 400) {
      setServerErr(userRes.error.message);
    }; 
  }

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
            <SignUpForm signUp={signUp} serverErr={serverErr}/>
          </Col>
        </Row>
      </Container>

    </div>
  )
}

export default Register;