import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface IProp {
  postId: number,
  commentId: number | undefined,
  isReply: boolean,
  handlePostComment: Function
}

function CommentForm({ postId, commentId , isReply, handlePostComment}: IProp) {
  const INITIAL_FORM_VALUES = { comment: "" } 
  const [ formData, setFormData ] = useState(INITIAL_FORM_VALUES);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData(currData => ({ ...currData, [name]: value }));
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log("submitting comment to post ", postId);
    if (isReply) {
      //submit commit as a reply comment to a comment of a post
      handlePostComment(postId, commentId, isReply, formData);
    } else {
      //submit commit as a regular comment to a post
      handlePostComment(postId, isReply, formData);
    }
  }

  return (
    <div className="CommentForm">
      <Form onSubmit={handleSubmit}>
        <Form.Control as="textarea" rows={3} name="comment" value={formData.comment} placeholder="Enter comment" onChange={handleChange} required />
        <Button type="submit">Comment</Button>
      </Form>
    </div>
  );
};

export default CommentForm;