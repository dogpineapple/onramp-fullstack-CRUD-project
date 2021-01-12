import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface IProp {
  postId: number,
  commentId: number | undefined,
  isReply: boolean,
  handlePostComment: Function
}

/**
 * CommentForm component renders a controlled Form for creating a comment.
 * Can be used to post a `reply` comment or a `non-reply` comment.
 */
function CommentForm({ postId, commentId, isReply, handlePostComment }: IProp) {
  const INITIAL_FORM_VALUES = { comment: "" }
  const [formData, setFormData] = useState(INITIAL_FORM_VALUES);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData(currData => ({ ...currData, [name]: value }));
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    handlePostComment(postId, commentId, isReply, formData.comment);
    setFormData(INITIAL_FORM_VALUES);
  }

  return (
    <div className="CommentForm text-right">
      <Form onSubmit={handleSubmit}>
        <Form.Control as="textarea" rows={3} name="comment" value={formData.comment} placeholder="Enter comment" onChange={handleChange} required />
        <Button type="submit" className="mt-1" variant="success">Comment</Button>
      </Form>
    </div>
  );
};

export default CommentForm;