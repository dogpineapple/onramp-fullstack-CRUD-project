import React, { Fragment, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  margin-top: 50px;
`;
function CancelModal() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Fragment>
      <ButtonWrapper>
        <Button variant="danger" onClick={handleShow}>
          Yes, I want to Cancel!
        </Button>
      </ButtonWrapper>
      <Modal show={show} onHide={handleClose} keyboard={false} centered>
        <Modal.Body>Are you sure you want to cancel?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            No!
          </Button>
          <Button variant="danger">Yes!</Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default CancelModal;
