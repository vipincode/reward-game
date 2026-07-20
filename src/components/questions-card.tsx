import { useEffect, useState } from "react";
import type { Questions } from "../types";
import styles from "./game.module.css";

interface QuestionCardType {
  question: Questions;
  submitted: boolean;
  setSubmitted: (value: boolean) => void;
}

const QuestionCard = ({
  question,
  submitted,
  setSubmitted,
}: QuestionCardType) => {
  const [answer, setAnswers] = useState("");
  const [answerData, setAnswerData] = useState<string[]>([]);

  useEffect(() => {
    const answers = [...question.incorrect_answers];
    const randomIndex = Math.floor(Math.random() * (answers.length + 1));
    answers.splice(randomIndex, 0, question.correct_answer);
    setAnswerData(answers);
  }, [question]);

  const correctAnswer = question.correct_answer;

  return (
    <div className={styles.card}>
      <div className={styles.level}>
        Difficulty level{" "}
        <span className={styles.chip}>{question.difficulty}</span>
      </div>
      <div>{question.correct_answer === answer ? "Correct" : "Incorrect"}</div>
      <h2 className={styles.questionHeading}>{question.question}</h2>
      <div className={styles.badge}>{question.type}</div>
      <div>
        <div className={styles.cardView}>
          {answerData.map((ans, index) => {
            return (
              <label
                key={index}
                className={`${styles.questionCard} ${
                  submitted
                    ? ans === correctAnswer
                      ? styles.correct
                      : ans === answer
                        ? styles.incorrect
                        : ""
                    : ""
                }`}
              >
                {ans}
                <input
                  type="radio"
                  name="ans"
                  value={ans}
                  hidden
                  checked={answer === ans}
                  disabled={submitted}
                  onChange={(e) => {
                    (setAnswers(e.target.value), setSubmitted(true));
                    localStorage.setItem("correctAnswer", e.target.value);
                  }}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default QuestionCard;
