import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "./LoginForm.css";

interface IProp {
  loginUser: Function
}

/**
 * `LoginForm` renders a form for logging in a user.
 */
function LoginForm({ loginUser }: IProp) {

  const INITIAL_FORM_VALUES = { username: "", password: "" };
  const [formData, setFormData] = useState(INITIAL_FORM_VALUES);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData(currData => ({ ...currData, [name]: value }));
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    loginUser(formData);
  }

  return (
    <Container className="LoginForm d-flex flex-column">
      <div className="LoginForm-wrapper">
        <p className="LoginForm-title text-left">Welcome back!</p>
        <Form className="LoginForm-form" onSubmit={handleSubmit}>
          <Form.Control className="form-input" name="username" value={formData.username} placeholder="Username" onChange={handleChange} required></Form.Control >
          <Form.Control type="password" className="form-input" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required></Form.Control >
          <Button className="form-button" type="submit">Login</Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginForm;