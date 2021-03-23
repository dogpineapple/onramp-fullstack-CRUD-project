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
    if (checkStatus === "none") {
      setQuestions(data.primary_questions);
    } else if (checkStatus === "pending") {
      setQuestions(data.alternate_questions);
    }
  }, [checkStatus]);

  useEffect(() => {
    validateForm();
  }, [answers]);

  useEffect(() => {
    if (
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
    if (checkStatus === "pending") {
      if (data.includes("no!")) {
        answer = "rejected";
      } else {
        answer = "accepted";
      }
    } else if (checkStatus === "none") {
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
    dispatch(updateMembershipStatus(answer));
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
