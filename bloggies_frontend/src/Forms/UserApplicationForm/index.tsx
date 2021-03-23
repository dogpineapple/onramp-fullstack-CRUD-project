import React, { useState, useEffect } from "react";
import UserQuestions from "../../UserQuestions";
import data from "../../UserQuestions/questions.json";
import { Form, Container, Button } from "react-bootstrap";
import { updateMembershipStatus } from "../../redux/actionCreators";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CustomReduxState } from "../../custom";

interface IQuestions {
  question: string;
  answers: (string | number)[];
}

interface IAnswers {
  [key: string]: string | number;
}

interface IProps {
  show: boolean;
}

/**
 * User Application Form Component, can be used to render Application form or Supplementary Application Form sent to users with a pending status

  * data.primary_questions - contains questions rendered on the Application form

  * data.alternate_questions - contains alternate questions rendered on the Supplementary Application form sent to pending users
 */

function UserApplicationForm({ show }: IProps) {
  const checkStatus = useSelector(
    (st: CustomReduxState) => st.user.membership_status
  );
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  /* setting form to default questions, still need to add logic to switch between primary and alternate questions*/
  const [answers, setAnswers] = useState<IAnswers>({});
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // checks user status and will render primary questions or alternate questions
    if (checkStatus === "none") {
      setQuestions(data.primary_questions);
    } else if (checkStatus === "pending") {
      setQuestions(data.alternate_questions);
    }
  }, [checkStatus]);

  useEffect(() => {
    // validates if user has answered all questions with valid input, will enable submission button if so
    validateForm();
  }, [answers]);

  useEffect(() => {
    // will render membership status form if user has filled out form in the past
    if (
      // prop show will determine whether to display the membership status page or the additional questions to the pending user
      (checkStatus === "pending" && !show) ||
      checkStatus === "accepted" ||
      checkStatus === "rejected" ||
      checkStatus === "inactive"
    ) {
      history.push("/register/membership-status");
    }
  }, [checkStatus, show, history]);

  const validateForm = () => {
    let data = Object.values(answers);
    if (
      data.length === Object.values(questions).length &&
      !data.includes("--") &&
      data.length !== 0
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = Object.values(answers);
    let answer: string = '';
    // determines membership status for user filling out additional application
    if (checkStatus === "pending") {
      if (data.includes("no!")) {
        // rejected case
        answer = "rejected";
      } else {
        // accepted case
        answer = "accepted";
      }
    } else if (checkStatus === "none") {
      // determines membership status for user filling out primary application
      if (
        // rejected case
        data.includes("nope!") ||
        (data.includes("nothing!") && data.includes("0.5"))
      ) {
        answer = "rejected";
      }
      // pending case
      else if (data.includes("nothing!") || data.includes("0.5")) {
        answer = "pending";
      } else {
        // accepted case
        answer = "accepted";
      }
    }
    // dispatches action to update redux store with membership status
    dispatch(updateMembershipStatus(answer));
    // sends user to membership status form
    history.push("/register/membership-status");
  };
  return (
    <Container className="UserApplicationForm">
      <Form onSubmit={submitHandler}>
        {questions.map((question, index) => {
          return (
            <UserQuestions
              question={question}
              key={index}
              questionNumber={index}
              setAnswers={setAnswers}
            />
          );
        })}
        <Button type="submit" disabled={disabled}>
          Submit Application
        </Button>
      </Form>
    </Container>
  );
}

export default UserApplicationForm;
