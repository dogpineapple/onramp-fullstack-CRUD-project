import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface IProp {
  postBlog: Function
}

function NewBlogForm({postBlog}: IProp) {
  const INITIAL_FORM_VALUES = { title: "", description: "", body: "" }
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_VALUES);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData(currData => ({ ...currData, [name]: value }));
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const valid = form.checkValidity();
    if (!valid) {
      evt.stopPropagation();
    } else {
      postBlog(formData);
    }
    setValidated(true);
  }

  return (
    <div className="NewBlogForm">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control onChange={handleChange} name="title" value={formData.title} placeholder="Title" required />
          <Form.Control.Feedback type="invalid">Post must have a title.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Control onChange={handleChange} name="description" value={formData.description} placeholder="Subtitle" />
        </Form.Group>
        <Form.Group>
          <Form.Control as="textarea" name="body" value={formData.body} onChange={handleChange} placeholder="Body" />
        </Form.Group>
        <Button type="submit">Publish post</Button>
      </Form>
    </div>
  );
};

export default NewBlogForm;