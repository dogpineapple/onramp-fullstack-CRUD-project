import React, {useState, useEffect} from "react";
import { Form } from "react-bootstrap";

interface IProps {
  question: {
    question: string;
    answers: (string | number)[];
  },
  questionNumber: number,
  setAnswers: any,
  answers: {
    [key: string] : (string| number)
  }
}
const UserQuestions = ({ question, questionNumber,setAnswers, answers }: IProps) => {


  const submitAnswersHandler = (e?: any) => {
    let answersCopy = {...answers};
    answersCopy[questionNumber] = e.target.value;
    setAnswers(answersCopy);
  }

  return (
    <Form.Group className="UserQuestions mt-5">
      <Form.Label>{question.question}</Form.Label>
      <Form.Control as ="select" onChange={submitAnswersHandler}>
        {question.answers.map((answer) => (
          <option value={answer}>{answer}</option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default UserQuestions;
