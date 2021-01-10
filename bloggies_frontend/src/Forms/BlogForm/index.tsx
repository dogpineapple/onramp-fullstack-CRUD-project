import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Post } from "../../custom";

interface IProp {
  addPost: Function,
  post: Post | undefined,
  closeModal: Function | undefined
}

function BlogForm({addPost, post, closeModal }: IProp) {
  const INITIAL_FORM_VALUES = { title: post?.title || "", description: post?.description || "", body: post?.body || "" }
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
      addPost(formData);
      if (closeModal) {
        closeModal();
      }
    }
    setValidated(true);
  }

  return (
    <div className="BlogForm text-right">
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

export default BlogForm;