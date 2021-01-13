import React, { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { checkSignUpDataValid } from "../../helpers";
import "./SignUpForm.css";

interface IProp {
  signUp: Function,
  serverErr: string
}

/**
 * `SignUpForm` renders a form for registering a new user.
 */
function SignUpForm({ signUp, serverErr }: IProp) {
  const INITIAL_FORM_VALUES = { username: "", password: "", repeatPassword: "", display_name: "" };
  const [formData, setFormData] = useState(INITIAL_FORM_VALUES);
  const [validated, setValidated] = useState(false);
  const [isPwdMatch, setisPwdMatch] = useState(true);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData(currData => ({ ...currData, [name]: value }));
    if (name === "repeatPassword") {
      if (formData.password !== value) {
        setisPwdMatch(false);
      } else {
        setisPwdMatch(true);
      }
    }
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const valid = form.checkValidity();
    
    // check length requirements are met.
    const formDataValid = checkSignUpDataValid(formData.username,
      formData.password,
      formData.repeatPassword,
      formData.display_name);
      
    if (!valid || !formDataValid) {
      evt.stopPropagation();
    } else {
      signUp(formData);
    }
    setValidated(true);
  }

  return (
    <Container className="SignUp">
      <div className="SignUp-wrapper d-flex flex-column">
        {serverErr && <Alert variant="danger" className="App-alert">{serverErr}</Alert>}
        <Form noValidate validated={validated} className="SignUp-form" onSubmit={handleSubmit}>
          <p className="SignUp-title text-center">Account Registration</p>
          <Form.Group controlId="validationCustom01">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" value={formData.username} placeholder="Username" onChange={handleChange} isInvalid={Boolean(serverErr)} required></Form.Control >
            <Form.Text className="text-muted">This will be the username you login with.</Form.Text>
            <Form.Control.Feedback type="invalid">Must be at least 4 characters.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom02">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required></Form.Control >
            <Form.Text className="text-muted">Must contain at least 6 characters.</Form.Text>
          </Form.Group>
          <Form.Group controlId="validationCustom03">
            <Form.Label>Re-type password</Form.Label>
            <Form.Control type="password" name="repeatPassword" value={formData.repeatPassword} placeholder="Re-type password" onChange={handleChange} isInvalid={!isPwdMatch} required></Form.Control >
            <Form.Text className="text-muted">It should match the password above.</Form.Text>
          </Form.Group>
          <Form.Group controlId="validationCustom04">
            <Form.Label>What name will you go by?</Form.Label>
            <Form.Control name="display_name" value={formData.display_name} placeholder="Display name" onChange={handleChange} required></Form.Control >
            <Form.Text className="text-muted">This will be your publicly displayed name!</Form.Text>
            <Form.Control.Feedback type="invalid">Must enter a display name.</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Finish registration</Button>
        </Form>
      </div>
    </Container>
  );
};

export default SignUpForm;