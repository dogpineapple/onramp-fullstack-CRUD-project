import React from "react";
import { useSelector } from "react-redux";
import { CustomReduxState } from "../../custom";
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
 * renders a different message depending on the outcome of the application form
 */

function RegisterStatusPage() {
  const history = useHistory();
  const checkStatus = useSelector(
    (st: CustomReduxState) => st.user.membership_status
  );

  let text: string | null = null;
  let homeButton = (
    <button onClick={() => history.push("/")}>
      {"Take me back to the newsfeed!"}
    </button>
  );
  let paymentButton = (
    <button
      onClick={() => history.push("/payment/form")}
    >{`I'm Ready, Sign Me Up!`}</button>
  );

  if (checkStatus === "none") {
    text = "";
  } else if (checkStatus === "rejected") {
    text =
      "We are sorry, we will not be able to grant you membership at this time. Please apply again at a later date, we would love for you to be a part of the the Learning Circle community!";
  } else if (checkStatus === "pending") {
    text =
      "We would love to have you as a member of the Learning Circle, but we are going to need a bit more information first! You have been sent a follow up email with an additional questionnaire, please fill out at your earliest convenience!";
  } else if (checkStatus === "accepted") {
    text =
      "Congratulations! You have been approved to become a premium member of the Learning Circle! Click below to register for your subscription, we are excited to welcome you into the community!";
  } else if (checkStatus === "inactive") {
    text =
      "We see you have already filled out this application in the past and been approved We would love to have you back as a Premium Member of the Learning Circle, click below to re-activate your membership!";
  }

  return (
    <RegisterStatusContainer className="RegisterStatusPage">
      <RegisterStatusItem>
        <Paragraph>{text}</Paragraph>
      </RegisterStatusItem>
      <RegisterStatusItem>
          {/* check to see status of member to see what button to render */}
        {checkStatus === 'rejected' || checkStatus === 'pending' || checkStatus === 'none'? homeButton : paymentButton}
      </RegisterStatusItem>
    </RegisterStatusContainer>
  );
}

export default RegisterStatusPage;
