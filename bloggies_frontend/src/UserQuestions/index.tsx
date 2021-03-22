import React from "react";
import { Form } from "react-bootstrap";
interface IProps {
  question: {
    question: string;
    answers: (string | number)[];
  };
}
const UserQuestions = ({ question }: IProps) => {
  return (
    <Form.Group className="UserQuestions mt-5">
      <Form.Label>{question.question}</Form.Label>
      <Form.Control as ="select">
        {question.answers.map((answer) => (
          <option value={answer}>{answer}</option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default UserQuestions;
