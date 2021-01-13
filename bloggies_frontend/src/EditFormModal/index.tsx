import React from "react";
import { Modal } from "react-bootstrap";
import { Post, PostFormData } from "../custom";
import BlogForm from "../Forms/BlogForm";

interface IProp {
  show: boolean,
  handleClose: Function,
  item: Post | undefined,
  editItem: Function
}

/**
 * `EditFormModal` renders a `BlogForm` component for making an
 * edit for a post.
 * - passes a handler function to blogForm that invokes the `editItem` function
 *    in the parent component. (which will do a PATCH request)
 */
function EditFormModal({ show, handleClose, item, editItem }: IProp) {

  const handleUpdate = (data: PostFormData) => {
    editItem(data);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Make an edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BlogForm addPost={handleUpdate} post={item} closeModal={handleClose}/>
      </Modal.Body>
    </Modal>
  );
};

export default EditFormModal;