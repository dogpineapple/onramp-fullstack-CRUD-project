import React from "react";
import { Button, Modal } from "react-bootstrap";

interface IProp {
  show: boolean,
  handleClose: Function,
  deletePost: Function
}

/**
 * `DeleteModal` renders a confirmation modal that
 * confirms whether a user means to make a deletion (for a post).
 */
function DeleteModal({ show, handleClose, deletePost }: IProp) {

  const handleDelete = () => {
    deletePost();
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this post?
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleDelete} variant="danger">Yes</Button>
        <Button onClick={() => handleClose()}>Go back</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;