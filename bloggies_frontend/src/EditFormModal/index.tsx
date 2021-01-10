import React from "react";
import { Modal } from "react-bootstrap";
import BlogForm from "../Forms/BlogForm";

interface IProp {
  show: boolean,
  handleClose: Function,
  item: any,
  editItem: Function
}

function EditFormModal({ show, handleClose, item, editItem }: IProp) {

  const handleUpdate = (data: any) => {
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