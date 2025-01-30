import React, { useState, useEffect, useContext } from "react";
import styles from "./StartedTestFormNew.module.scss";
import { Button, Radio, Checkbox, Space } from "antd";
import { TimerContext } from "App";
import cn from "classnames";
import { ModalFinishTestNew } from "../ModalFinishTestNew/ModalFinishTestNew";

type TProps = {
  productTitle: string | undefined;
  handleOpenFinistTestModal: () => void;
  unansweredQuestions: {
    testTitle: string;
    questionNumber: number;
    questionId: string;
  }[];
  setUnansweredQuestions: React.Dispatch<
    React.SetStateAction<
      {
        testTitle: string;
        questionNumber: number;
        questionId: string;
      }[]
    >
  >;
  isFinishTestModalOpen: boolean;
  setIsFinishTestModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const StartedTestFormNew = ({
  productTitle,
  handleOpenFinistTestModal,
  unansweredQuestions,
  setUnansweredQuestions,
  isFinishTestModalOpen,
  setIsFinishTestModalOpen,
}: TProps) => {
  const {
    // @ts-ignore
    timeLeft,
    // @ts-ignore
    formatTime,
    // @ts-ignore
    testIsStarted,
    // @ts-ignore
    timerInitialized,
    // @ts-ignore
    handleCompleteTest,
    // @ts-ignore
    isCompleting,
  } = useContext(TimerContext);
  const testDataFromLocalStorage = localStorage.getItem("test");
  const parsedData = testDataFromLocalStorage
    ? JSON.parse(testDataFromLocalStorage)
    : [];

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string | string[];
  }>({});
  const [questionIndices, setQuestionIndices] = useState<{
    [key: number]: number;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("selectedAnswers");
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }

    const savedQuestionIndices = localStorage.getItem("questionIndices");
    if (savedQuestionIndices) {
      setQuestionIndices(JSON.parse(savedQuestionIndices));
    }
  }, []);

  useEffect(() => {
    const savedIndex = questionIndices[currentTestIndex] || 0;
    setCurrentQuestionIndex(savedIndex);
  }, [currentTestIndex, questionIndices]);

  const handleTestSelect = (index: number) => {
    setQuestionIndices((prev) => {
      const updatedIndices = {
        ...prev,
        [currentTestIndex]: currentQuestionIndex,
      };
      localStorage.setItem("questionIndices", JSON.stringify(updatedIndices));
      return updatedIndices;
    });

    setCurrentTestIndex(index);
  };

  const handleNextQuestion = () => {
    if (
      currentQuestionIndex <
      parsedData[currentTestIndex].questions.length - 1
    ) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);

      setQuestionIndices((prev) => {
        const updatedIndices = {
          ...prev,
          [currentTestIndex]: nextQuestionIndex,
        };
        localStorage.setItem("questionIndices", JSON.stringify(updatedIndices));
        return updatedIndices;
      });
    } else if (currentTestIndex < parsedData.length - 1) {
      setQuestionIndices((prev) => {
        const updatedIndices = {
          ...prev,
          [currentTestIndex]: currentQuestionIndex,
        };
        localStorage.setItem("questionIndices", JSON.stringify(updatedIndices));
        return updatedIndices;
      });

      setCurrentTestIndex(currentTestIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestionIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevQuestionIndex);

      setQuestionIndices((prev) => {
        const updatedIndices = {
          ...prev,
          [currentTestIndex]: prevQuestionIndex,
        };
        localStorage.setItem("questionIndices", JSON.stringify(updatedIndices));
        return updatedIndices;
      });
    } else if (currentTestIndex > 0) {
      setQuestionIndices((prev) => {
        const updatedIndices = {
          ...prev,
          [currentTestIndex]: currentQuestionIndex,
        };
        localStorage.setItem("questionIndices", JSON.stringify(updatedIndices));
        return updatedIndices;
      });

      setCurrentTestIndex(currentTestIndex - 1);
      setCurrentQuestionIndex(
        parsedData[currentTestIndex - 1].questions.length - 1
      );
    }
  };

  const handleOptionChange = (e: any) => {
    const currentQuestionId =
      parsedData[currentTestIndex].questions[currentQuestionIndex].id;
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestionId]: e.target.value,
    };

    setSelectedAnswers(updatedAnswers);
    localStorage.setItem("selectedAnswers", JSON.stringify(updatedAnswers));
  };

  const handleMultiOptionChange = (checkedValues: string[]) => {
    const currentQuestionId =
      parsedData[currentTestIndex].questions[currentQuestionIndex].id;

    // Allow only 2 selections for task_type=8 or task_type=6
    if (checkedValues.length > 2) {
      checkedValues = checkedValues.slice(0, 2);
    }

    // Store only the first selected option in the request
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestionId]: checkedValues[0], // Only the first option is sent
    };

    setSelectedAnswers(updatedAnswers);
    localStorage.setItem("selectedAnswers", JSON.stringify(updatedAnswers));
  };

  const handleQuestionSelect = (index: number) => {
    const currentQuestionId = parsedData[currentTestIndex].questions[index].id;

    const updatedUnansweredQuestions = unansweredQuestions.filter(
      (question) => question.questionId !== currentQuestionId
    );
    setUnansweredQuestions(updatedUnansweredQuestions);

    setCurrentQuestionIndex(index);

    setQuestionIndices((prev) => {
      const updatedIndices = { ...prev, [currentTestIndex]: index };
      localStorage.setItem("questionIndices", JSON.stringify(updatedIndices));
      return updatedIndices;
    });
  };

  const findUnansweredQuestions = () => {
    const unanswered: {
      testTitle: string;
      questionNumber: number;
      questionId: string;
    }[] = [];

    parsedData.forEach((test: any, testIndex: number) => {
      test.questions.forEach((question: any, questionIndex: number) => {
        const answer = selectedAnswers[question.id];
        const isUnanswered =
          question.task_type === 8 || question.task_type === 6
            ? !Array.isArray(answer) || answer.length === 0 // Multi-select questions
            : !answer; // Single-select questions
  
        if (isUnanswered) {
          unanswered.push({
            testTitle: test.title,
            questionNumber: questionIndex + 1,
            questionId: question.id,
          });
        }
      });
    });

    setUnansweredQuestions(unanswered);
  };

  if (!parsedData.length) {
    return <div>Нет данных для теста</div>;
  }

  const currentTest = parsedData[currentTestIndex];
  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const isLastQuestionOfLastTest =
    currentTestIndex === parsedData.length - 1 &&
    currentQuestionIndex === currentTest.questions.length - 1;

  const isQuestionUnanswered = (questionId: string) =>
    unansweredQuestions.some(
      (unanswered) => unanswered.questionId === questionId
    );

  const isQuestionAnswered = (questionId: string) =>
    !!selectedAnswers[questionId];

  return (
    <>
      <div className={styles.testForm}>
        <div>
          <div
            className={styles.navigationButtons}
            style={{
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => {
                handleOpenFinistTestModal();
                findUnansweredQuestions();
              }}
              className={cn(
                styles.testForm__button,
                styles.testForm__button__finish
              )}
            >
              Тестілеуді аяқтау
            </Button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Button
                onClick={() => handleTestSelect(currentTestIndex - 1)}
                disabled={currentTestIndex === 0}
                className={cn(
                  styles.testForm__button,
                  styles.testForm__button__white
                )}
              >
                {"< Алдыңғы пән"}
              </Button>

              <Button
                onClick={() => handleTestSelect(currentTestIndex + 1)}
                disabled={currentTestIndex === parsedData.length - 1}
                className={cn(
                  styles.testForm__button,
                  styles.testForm__button__white
                )}
              >
                {"Келесі пән >"}
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.questionTabs}>
          {currentTest.questions.map((question: any, index: number) => (
            <button
              key={index}
              className={cn(styles.questionTab, {
                [styles.unanswered]: isQuestionUnanswered(question.id),
                [styles.answered]: isQuestionAnswered(question.id),
                [styles.questionTab__isActive]: index === currentQuestionIndex,
              })}
              onClick={() => handleQuestionSelect(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div
          className={cn(
            styles.navigationButtons,
            styles.navigationButtons__white
          )}
        >
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentTestIndex === 0 && currentQuestionIndex === 0}
            className={cn(
              styles.testForm__button,
              styles.testForm__button__back
            )}
          >
            {"< Алдыңғы сұрақ"}
          </Button>

          {timerInitialized && testIsStarted && timeLeft > 0 && (
            <div className={cn(styles.timer)}>
              Осталось: {formatTime(timeLeft)}
            </div>
          )}

          <h2 className={styles.currentTestTitle}>{currentTest.title}</h2>

          <h3 className={styles.currentQuestionNumber}>
            Сұрақ № {currentQuestionNumber}
          </h3>

          <h3>task_type: {currentQuestion?.task_type}</h3>

          <Button
            onClick={handleNextQuestion}
            disabled={isLastQuestionOfLastTest}
            className={cn(styles.testForm__button, styles.testForm__button)}
          >
            {"Келесі сұрақ >"}
          </Button>
        </div>

        <div className={styles.divider} style={{ marginTop: 64 }}></div>

        <div className={styles.questionText}>{currentQuestion?.text}</div>

        {currentQuestion?.img && (
          <div className={styles.questionImage}>
            <img
              src={currentQuestion.img}
              alt="Question Illustration"
              className={styles.image}
            />
          </div>
        )}

        <div className={styles.divider}></div>

        <div className={styles.options}>
            {currentQuestion?.task_type === 8 || currentQuestion?.task_type === 6 ? (
              <Checkbox.Group
                value={
                  Array.isArray(selectedAnswers[currentQuestion.id])
                    ? (selectedAnswers[currentQuestion.id] as string[])
                    : [] // Ensure it's always an array
                }
                onChange={handleMultiOptionChange}
              >
                <Space direction="vertical">
                  {currentQuestion.options.map((option: any) => (
                    <Checkbox key={option.id} value={option.id}>
                      {option.img && (
                        <img
                          src={option.img}
                          alt="Option Illustration"
                          className={styles.optionImage}
                        />
                      )}
                      {option.text}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            ) : (
            <Radio.Group
              value={
                typeof selectedAnswers[currentQuestion.id] === "string"
                  ? selectedAnswers[currentQuestion.id]
                  : null // Ensure it's a string or null
              }
              onChange={handleOptionChange}
            >
              <Space direction="vertical">
                {currentQuestion.options.map((option: any) => (
                  <Radio key={option.id} value={option.id}>
                    {option.img && (
                      <img
                        src={option.img}
                        alt="Option Illustration"
                        className={styles.optionImage}
                      />
                    )}
                    {option.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}
        </div>
      </div>
      <ModalFinishTestNew
        isOpen={isFinishTestModalOpen}
        setOpen={setIsFinishTestModalOpen}
        unansweredQuestions={unansweredQuestions}
        handleCompleteTest={handleCompleteTest}
        isCompleting={isCompleting}
      />
    </>
  );
};

export default StartedTestFormNew;