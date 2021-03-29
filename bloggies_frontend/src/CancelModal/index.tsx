import React, { Fragment, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { cancelPremiumUserMembership } from "../redux/actionCreators";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CustomReduxState } from "../custom";

const ButtonWrapper = styled.div`
`;

function CancelModal() {
  const subscriptionId = useSelector(
    (st: CustomReduxState) => st.user.subscription_id
  );
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleCancel = () => {
    dispatch(cancelPremiumUserMembership(subscriptionId));
    history.push("/register/membership-status");
  };
  
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
          <Button onClick={handleCancel} variant="danger">
            Yes!
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default CancelModal;
