import { useEffect, useState } from "react";
import { API_URL, questionLabel, type Questions } from "../types";
import styles from "./game.module.css";
import QuestionCard from "./questions-card";

const Game = () => {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [rewards, setRewards] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(1 * 60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await response.json();
        setQuestions(data.results);
        setTotalQuestion(data.results.length);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getQuestionByIndex = questions[questionIndex];

  const handleNext = () => {
    if (questionIndex < questions.length) {
      setQuestionIndex((prev) => prev + 1);
      setTotalQuestion(totalQuestion - 1);
    }
    handleRewards();
    setSubmitted(false);
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      setTotalQuestion(totalQuestion + 1);
    }
    setSubmitted(false);
  };

  const handleRewards = () => {
    const selectAnswer = localStorage.getItem("correctAnswer");
    if (getQuestionByIndex.correct_answer === selectAnswer) {
      if (getQuestionByIndex.difficulty === questionLabel.EASY)
        setRewards((prev) => prev + 1000);
      if (getQuestionByIndex.difficulty === questionLabel.MEDIUM)
        setRewards((prev) => prev + 2000);
      if (getQuestionByIndex.difficulty === questionLabel.HARD)
        setRewards((prev) => prev + 5000);
    }
  };

  if (questionIndex === questions.length - 1 || timeLeft === 0) {
    return (
      <div className={styles.done}>
        <h2>Great job you have done</h2>
        <button
          className={styles.btnSecondary}
          onClick={() => {
            setQuestionIndex(0);
            setTimeLeft(1 * 60);
            setRewards(0);
            localStorage.clear();
          }}
        >
          Lets try again!
        </button>
      </div>
    );
  }

  if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.heading}>
        Game have total {questions.length} questions
      </h1>
      <div
        className={styles.card}
        style={{
          padding: "14px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          className={styles.questionCount}
          style={{ alignItems: "flex-start", margin: 0 }}
        >
          <p>For Easy Get: 1000 points</p>
          <p>For Medium Get: 2000 points</p>
          <p>For Hard Get: 5000 points</p>
        </div>
        <div className={styles.questionCount} style={{ margin: 0 }}>
          <p>
            Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
          <p>Total Points: {rewards}</p>
          <p>Question No: {questionIndex + 1}</p>
        </div>
      </div>
      {questions.length > 0 ? (
        <QuestionCard
          question={getQuestionByIndex}
          setSubmitted={setSubmitted}
          submitted={submitted}
        />
      ) : (
        <div>No Questions</div>
      )}

      <div className={styles.btnBox}>
        <button className={styles.btnPrimary} onClick={handlePrev}>
          Previous
        </button>
        <button className={styles.btnSecondary} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Game;
