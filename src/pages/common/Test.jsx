import React, { useState } from 'react';

const Test = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const selectQuestion = (questionNumber) => {
    setCurrentQuestion(questionNumber);
  };

  return (
    <main className='test-page main-wrapper relative overflow-hidden pt-[150px] pb-[150px]'>
      <div className="test-container">
        <div className="question-nav">
          <button className="nav-button prev-button">Предыдущий предмет</button>
          <button className="nav-button next-button">Следующий предмет</button>
        </div>
        <h3>Бөлім: Тарих (Қазақстан тарихы/Дүниежүзі тарихы)</h3>
        <div className="questions-list">
          <div className="question-buttons">
            {[...Array(20).keys()].map((_, index) => (
              <button
                key={index}
                className={`question-btn ${currentQuestion === index + 1 ? 'selected' : ''}`}
                onClick={() => selectQuestion(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="content">
          <div className="question-text">
            <p>Сарматтар разводили очень много лошадей, которые отличались высоким ростом и были очень выносливыми...</p>
          </div>
          <div className="answer-options">
            <label>
              <input type="radio" name="answer" value="A" />
              А) Диодор
            </label>
            <label>
              <input type="radio" name="answer" value="B" />
              B) Овидий
            </label>
            <label>
              <input type="radio" name="answer" value="C" />
              C) Геродот
            </label>
            <label>
              <input type="radio" name="answer" value="D" />
              D) Плиний
            </label>
          </div>
        </div>
        <div className="navigation-buttons">
          <button id="prev-question" className="nav-button prev-button">Предыдущий вопрос</button>
          <button id="next-question" className="nav-button next-button">Следующий вопрос</button>
        </div>
      </div>
    </main>
  );
};

export default Test;
