import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "./SignUpForm.css";

function SignUpForm() {
  const INITIAL_FORM_VALUES = { username: "", password: "", repeatPassword: "", display_name: "" };
  const [formData, setFormData] = useState(INITIAL_FORM_VALUES);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData(currData => ({ ...currData, [name]: value }));
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
  }

  return (
    <Container className="SignUp">
      <div className="SignUp-wrapper d-flex flex-column">
        <Form className="SignUp-form" onSubmit={handleSubmit}>
          <p className="SignUp-title text-center">Account Registration</p>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" value={formData.username} placeholder="Username" onChange={handleChange} required></Form.Control >
            <Form.Text className="text-muted">This will be the username you login with.</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" value={formData.password} placeholder="Password" onChange={handleChange} required></Form.Control >
            <Form.Text className="text-muted">Must contain at least 6 characters.</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Re-type password</Form.Label>
            <Form.Control name="repeatPassword" value={formData.repeatPassword} placeholder="Re-type password" onChange={handleChange} required></Form.Control >
            <Form.Text className="text-muted">It should match the password above.</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>What would you like to be known as?</Form.Label>
            <Form.Control name="display_name" value={formData.display_name} placeholder="Display name" onChange={handleChange} required></Form.Control >
            <Form.Text className="text-muted">This will be your publicly displayed name!</Form.Text>
          </Form.Group>
          <Button type="submit">Finish registration</Button>
        </Form>
      </div>
    </Container>
  );
};

export default SignUpForm;