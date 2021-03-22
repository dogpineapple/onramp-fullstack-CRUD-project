import React, { useState, useEffect } from "react";
import UserQuestions from "../../UserQuestions";
import data from "../../UserQuestions/questions.json";
import { Form , Container, Button } from "react-bootstrap";

interface IQuestions {
  question: string;
  answers: (string | number)[];
}

interface IAnswers {
  [key: string]: (string|number)
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

  useEffect(() => {
    setQuestions(data.primary_questions);
  }, []);

  return (
    <Container className="UserApplicationForm">
      <Form>
        {questions.map((question, index) => {
          return <UserQuestions question={question} key={index} questionNumber={index} setAnswers={setAnswers} answers={answers}/>;
        })}
        <Button type="submit">Submit Application</Button>
      </Form>
    </Container>
  );
}

export default UserApplicationForm;
