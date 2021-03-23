import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomReduxState, User } from "../../custom";
import styled from "styled-components";
import { useHistory } from "react-router";

const RegisterStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RegisterStatusItem = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 70%;
`;
const Paragraph = styled.p`
  font-size: 30px;
`;

/**
 * RegisterStatusPage renders a successful registration page and shows
 * the membership status of the newly registered user.
 */
// interface IProps {
//     user: User
// }
function RegisterStatusPage() {
  const history = useHistory();
  const checkStatus = useSelector(
    (st: CustomReduxState) => st.user.membership_status
  );

  let text: string | null = null;
  let buttonText: string | null = null;
  let clickFunction = () => {}

  if (checkStatus === "none") {
    text = "";
  } else if (checkStatus === "rejected") {
    text =
      "We are sorry, we will not be able to grant you membership at this time. Please apply again at a later date, we would love for you to be a part of the the Learning Circle community!";
    buttonText = "Take me back to the newsfeed!";
  } else if (checkStatus === "pending") {
    text =
      "We would love to have you as a member of the Learning Circle, but we are going to need a bit more information first! You have been sent a follow up email with an additional questionnaire, please fill out at your earliest convenience!";
    buttonText = "Take me back to the newsfeed!";
    clickFunction = () => (history.push('/register/membership-form'))
  } else if (checkStatus === "accepted") {
    text =
      "Congratulations! You have been approved to become a premium member of the Learning Circle! Click below to register for your subscription, we are excited to welcome you into the community!";
    buttonText = "I'm Ready, Sign Me Up!";
  }

  return (
    <RegisterStatusContainer className="RegisterStatusPage">
      <RegisterStatusItem>
        <Paragraph>{text}</Paragraph>
      </RegisterStatusItem>
      <RegisterStatusItem>
        <button onClick={clickFunction}>{buttonText}</button>
      </RegisterStatusItem>
    </RegisterStatusContainer>
  );
}

export default RegisterStatusPage;
