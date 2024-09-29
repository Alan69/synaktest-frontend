import React, { useState, useEffect, useContext } from 'react';
import styles from './StartedTestForm.module.scss';
import { Button, Radio, Space } from 'antd';
import { TimerContext } from 'App';
import cn from 'classnames';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-left.svg';

const StartedTestForm = () => {
  // @ts-ignore
  const { timeLeft, formatTime, testIsStarted, timerInitialized } = useContext(TimerContext);
  const testDataFromLocalStorage = localStorage.getItem('test');
  const parsedData = testDataFromLocalStorage ? JSON.parse(testDataFromLocalStorage) : [];

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [questionIndices, setQuestionIndices] = useState<{ [key: number]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('selectedAnswers');
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }

    const savedQuestionIndices = localStorage.getItem('questionIndices');
    if (savedQuestionIndices) {
      setQuestionIndices(JSON.parse(savedQuestionIndices));
    }
  }, []);

  useEffect(() => {
    const savedIndex = questionIndices[currentTestIndex] || 0;
    setCurrentQuestionIndex(savedIndex);
    setSelectedOption(selectedAnswers[parsedData[currentTestIndex]?.questions[savedIndex]?.id] || null);
  }, [currentTestIndex, parsedData, questionIndices, selectedAnswers]);

  const handleTestSelect = (index: number) => {
    setQuestionIndices((prev) => {
      const updatedIndices = { ...prev, [currentTestIndex]: currentQuestionIndex };
      localStorage.setItem('questionIndices', JSON.stringify(updatedIndices));
      return updatedIndices;
    });

    setCurrentTestIndex(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < parsedData[currentTestIndex].questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);

      setQuestionIndices((prev) => {
        const updatedIndices = { ...prev, [currentTestIndex]: nextQuestionIndex };
        localStorage.setItem('questionIndices', JSON.stringify(updatedIndices));
        return updatedIndices;
      });
    } else if (currentTestIndex < parsedData.length - 1) {
      setQuestionIndices((prev) => {
        const updatedIndices = { ...prev, [currentTestIndex]: currentQuestionIndex };
        localStorage.setItem('questionIndices', JSON.stringify(updatedIndices));
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
        const updatedIndices = { ...prev, [currentTestIndex]: prevQuestionIndex };
        localStorage.setItem('questionIndices', JSON.stringify(updatedIndices));
        return updatedIndices;
      });
    } else if (currentTestIndex > 0) {
      setQuestionIndices((prev) => {
        const updatedIndices = { ...prev, [currentTestIndex]: currentQuestionIndex };
        localStorage.setItem('questionIndices', JSON.stringify(updatedIndices));
        return updatedIndices;
      });

      setCurrentTestIndex(currentTestIndex - 1);
      setCurrentQuestionIndex(parsedData[currentTestIndex - 1].questions.length - 1);
    }
  };

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);

    const currentQuestionId = parsedData[currentTestIndex].questions[currentQuestionIndex].id;
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestionId]: e.target.value,
    };

    setSelectedAnswers(updatedAnswers);
    localStorage.setItem('selectedAnswers', JSON.stringify(updatedAnswers));
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(selectedAnswers[parsedData[currentTestIndex]?.questions[index]?.id] || null);

    setQuestionIndices((prev) => {
      const updatedIndices = { ...prev, [currentTestIndex]: index };
      localStorage.setItem('questionIndices', JSON.stringify(updatedIndices));
      return updatedIndices;
    });
  };

  if (!parsedData.length) {
    return <div>Нет данных для теста</div>;
  }

  const currentTest = parsedData[currentTestIndex];
  const currentQuestion = currentTest.questions[currentQuestionIndex];

  return (
    <div className={styles.testForm}>
      {timerInitialized && testIsStarted && timeLeft > 0 && (
        <div className={styles.timer}>
          Осталось: {formatTime(timeLeft)}
        </div>
      )}

      <div className={styles.tabs}>
        {parsedData.map((test: any, index: number) => (
          <button
            key={test.title}
            className={`${styles.tab} ${index === currentTestIndex ? styles.tab__isActive : ''}`}
            onClick={() => handleTestSelect(index)}
          >
            {test.title}
          </button>
        ))}
      </div>

      <div className={styles.questionTabs}>
        {currentTest.questions.map((question: any, index: number) => (
          <button
            key={index}
            className={`${styles.questionTab} ${index === currentQuestionIndex ? styles.questionTab__isActive : ''}`}
            onClick={() => handleQuestionSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className={styles.questionText}>{currentQuestion.text}</div>

      <div className={styles.options}>
        <Radio.Group value={selectedOption} onChange={handleOptionChange}>
          <Space direction="vertical">
            {currentQuestion.options.map((option: any) => (
              <Radio key={option.id} value={option.id} className={styles.option}>
                {option.text}
              </Radio>
            ))}
          </Space>

        </Radio.Group>
      </div>

      <div className={styles.navigationButtons}>
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentTestIndex === 0 && currentQuestionIndex === 0}
          className={cn(styles.testForm__button, styles.testForm__button__back)}
        >
          <IconArrow /> Предыдущий вопрос
        </Button>
        <Button
          onClick={handleNextQuestion}
          disabled={currentTestIndex === parsedData.length - 1 && currentQuestionIndex === currentTest.questions.length - 1}
          className={cn(styles.testForm__button, styles.testForm__button)}
        >
          Следующий вопрос <IconArrow />
        </Button>
      </div>
    </div>
  );
};

export default StartedTestForm;
