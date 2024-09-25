import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Payment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState('9 класс МОДО');
  const [selectedTariff, setSelectedTariff] = useState('Разовый - 990 т');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Банковская карта');

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePayment = () => {
    setTimeout(() => {
      navigate('/test');
    }, 2000);
  };

  return (
    <main className='main-wrapper relative overflow-hidden pt-[150px] pb-[150px]'>
      <div className="payment-container">
        <h2>Купить экзамен</h2>
        <div className="step-container">
          <div className="line"></div>
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="circle">{step > 1 ? <i className="checkmark">✓</i> : ''}</div>
            <div>Экзамен</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="circle">{step > 2 ? <i className="checkmark">✓</i> : ''}</div>
            <div>Тариф</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="circle">{step > 3 ? <i className="checkmark">✓</i> : ''}</div>
            <div>Оплата</div>
          </div>
        </div>
        {step === 1 && (
          <div className="content active" id="step-1">
            <h3>Выберите вид экзамена</h3>
            <div className="payment-method">
              <button
                className={`exam-button ${selectedExam === 'ЕНТ' ? 'selected' : ''}`}
                onClick={() => setSelectedExam('ЕНТ')}
              >
                ЕНТ
              </button>
              <button
                className={`exam-button ${selectedExam === '11 класс ЕНТ' ? 'selected' : ''}`}
                onClick={() => setSelectedExam('11 класс ЕНТ')}
              >
                Админ срез
              </button>

              <button
                className={`exam-button ${selectedExam === 'Озп' ? 'selected' : ''}`}
                onClick={() => setSelectedExam('Озп')}
              >
                Озп
              </button>
            </div>
            <div className="button-container">
              <button className="next-button" onClick={handleNextStep}>Далее</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="content active" id="step-2">
            <h3>Выберите тариф</h3>
            <div className="payment-method">
              <button
                className={`tariff-button ${selectedTariff === 'Разовый - 990 т' ? 'selected' : ''}`}
                onClick={() => setSelectedTariff('Разовый - 990 т')}
              >
                Разовый - 990 т
              </button>
              <button
                className={`tariff-button ${selectedTariff === 'Подписка - 2000 т' ? 'selected' : ''}`}
                onClick={() => setSelectedTariff('Подписка - 2000 т')}
              >
                Подписка - 2000 т
              </button>
            </div>
            <div className="button-container">
              <button className="prev-button" onClick={handlePrevStep}>Назад</button>
              <button className="next-button" onClick={handleNextStep}>Далее</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="content active" id="step-3">
            <h3>Выберите способ оплаты</h3>
            <div className="payment-method">
              <button
                className={`payment-method-button ${selectedPaymentMethod === 'Банковская карта' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('Банковская карта')}
              >
                Банковская карта
              </button>
              <button
                className={`payment-method-button ${selectedPaymentMethod === 'Kaspi.kz' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('Kaspi.kz')}
              >
                <img src="https://kaspi.kz/kz/pay/img/logo_kaspi.png" alt="Kaspi.kz" className="payment-method-img" />
              </button>
            </div>
            <div className="summary">
              <p>Экзамен: {selectedExam}</p>
              <p>Тариф: {selectedTariff}</p>
              <p>Способ оплаты: {selectedPaymentMethod}</p>
              <p>Сумма: {selectedTariff === 'Разовый - 990 т' ? '990 т' : '2000 т'}</p>
            </div>
            <div className="button-container">
              <button className="prev-button" onClick={handlePrevStep}>Назад</button>
              <button className="next-button" onClick={handlePayment}>Оплатить заказ</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Payment;
