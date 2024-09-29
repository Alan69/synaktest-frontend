import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useFetchTestsQuery,
  useFetchTestQuestionsQuery,
  useFetchOptionsQuery,
  useSubmitResultMutation,
} from '../../redux/api/testsAPI';
import styles from './Quiz.module.css';

const Quiz = () => {
  const { testIds } = useParams();
  const ids = testIds?.split(',').map(id => parseInt(id, 10));

  const { data: tests = [], isLoading: isTestsLoading } = useFetchTestsQuery(ids);
  const { data: questions = [], isLoading: isQuestionsLoading, refetch: refetchQuestions } = useFetchTestQuestionsQuery(tests.length ? tests[0].id : null, { skip: !tests.length });
  // @ts-ignore
  const { data: options = [], isLoading: isOptionsLoading } = useFetchOptionsQuery();
  const [submitResult] = useSubmitResultMutation();

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (tests.length > 0) {
      refetchQuestions();
    }
  }, [tests, refetchQuestions]);

  useEffect(() => {
    if (questions.length > 0 && options.length > 0) {
      questions.forEach(question => {
        question.options = options.filter(option => option.question === question.id);
      });
    }
  }, [questions, options]);

  const handleNextTest = async () => {
    const nextIndex = Math.min(currentTestIndex + 1, tests.length - 1);
    setCurrentTestIndex(nextIndex);
    setCurrentQuestionIndex(0);
  };

  const handlePreviousTest = async () => {
    const prevIndex = Math.max(currentTestIndex - 1, 0);
    setCurrentTestIndex(prevIndex);
    setCurrentQuestionIndex(0);
  };

  const handleNextQuestion = () => {
    const nextIndex = Math.min(currentQuestionIndex + 1, questions.length - 1);
    setCurrentQuestionIndex(nextIndex);
  };

  const handlePreviousQuestion = () => {
    const prevIndex = Math.max(currentQuestionIndex - 1, 0);
    setCurrentQuestionIndex(prevIndex);
  };

  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    const results = Object.entries(selectedOptions).map(([questionId, optionId]) => ({
      question: questionId,
      selected_option: optionId,
    }));

    try {
      await submitResult({ results });
      alert('Results submitted successfully!');
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  if (isTestsLoading || isQuestionsLoading || isOptionsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.testPage}>
      <div className={styles.testContainer}>
        <div className={styles.questionNav}>
          <button className={styles.navButton} onClick={handlePreviousTest}>Предыдущий тест</button>
          <button className={styles.navButton} onClick={handleNextTest}>Следующий тест</button>
        </div>
        <h3>Тест: {tests[currentTestIndex]?.title}</h3>
        <div className={styles.questionsList}>
          <div className={styles.questionButtons}>
            {questions.map((question, index) => (
              <button
                key={question.id}
                className={`${styles.questionBtn} ${currentQuestionIndex === index ? styles.selected : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.content}>
          {questions.length > 0 && (
            <>
              <div className={styles.questionText}>
                <p>{questions[currentQuestionIndex]?.text}</p>
              </div>
              <div className={styles.answerOptions}>
                {questions[currentQuestionIndex]?.options.map(option => (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name={`question_${questions[currentQuestionIndex].id}`}
                      value={option.id}
                      checked={selectedOptions[questions[currentQuestionIndex].id] === option.id}
                      onChange={() => handleOptionChange(questions[currentQuestionIndex].id, option.id)}
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.navigationButtons}>
          <button className={styles.navButton} onClick={handlePreviousQuestion}>Предыдущий вопрос</button>
          <button className={styles.navButton} onClick={handleNextQuestion}>Следующий вопрос</button>
        </div>
        <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
      </div>
    </main>
  );
};

export default Quiz;
