import React, { useState, useEffect } from "react";
import UserQuestions from "../../UserQuestions";
import data from "../../UserQuestions/questions.json";
import { Form, Container, Button } from "react-bootstrap";

interface IQuestions {
  question: string;
  answers: (string | number)[];
}

interface IAnswers {
  [key: string]: string | number;
}

// interface IProps {
//   setAnswers: any
// }
/**
 * User Application Form Component, can be used to render Application form or Supplementary Application Form sent to users with a pending status

  * data.primary_questions - contains questions rendered on the Application form

  * data.alternate_questions - contains alternate questions rendered on the Supplementary Application form sent to pending users
 */

function UserApplicationForm() {
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  /* setting form to default questions, still need to add logic to switch between primary and alternate questions*/
  const [answers, setAnswers] = useState<IAnswers>({});
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    setQuestions(data.primary_questions);
  }, []);

  useEffect(() => {
    validateForm();
  }, [answers]);

  const validateForm = () => {
    let data = Object.values(answers);
    if (data.length === 5 && !data.includes("--")) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = Object.values(answers);
    // rejected case
    if (
      data.includes("nope!") ||
      (data.includes("nothing!") &&
      data.includes("0.5"))
    ) {
      console.log("rejected case");

    }
    // pending case
    else if (
      data.includes("nothing!") ||
      data.includes("0.5")
    ) {
      console.log("pending case");
    }
    else {
      console.log("accepted case")
    }
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
