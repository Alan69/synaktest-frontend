import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useFetchProductQuery,
  useFetchTestsQuery,
  usePurchaseProductMutation,
} from '../../redux/api/productsAPI'; // Подкорректируйте путь

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTests, setSelectedTests] = useState([]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const { data: product, isLoading: productLoading, isError: productError } = useFetchProductQuery(id);
  const { data: tests = [], isLoading: testsLoading, isError: testsError } = useFetchTestsQuery(id);
  const [purchaseProduct, { isLoading: isPurchasing }] = usePurchaseProductMutation();

  const handleTestChange = (e: any) => {
    const { value, checked } = e.target;
    // @ts-ignore
    setSelectedTests((prevSelectedTests) =>
      checked ? [...prevSelectedTests, value] : prevSelectedTests.filter((test) => test !== value)
    );
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (selectedTests.length < 1 || selectedTests.length > 5) {
      setError('Пожалуйста, выберите от 1 до 5 тестов.');
      return;
    }

    try {
      await purchaseProduct(id);
      navigate(`/quiz/${selectedTests.join(',')}`);
    } catch (error) {
      console.error('Error purchasing product', error);
      setError('Недостаточно средств для покупки этого продукта.');
    }
  };

  if (productLoading || testsLoading) {
    return <div>Loading...</div>;
  }

  if (productError || testsError) {
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <main className='main-wrapper relative overflow-hidden pt-[150px] pb-[150px]'>
      <div className="payment-container">
        <h2>Купить продукт</h2>
        <div className="step-container">
          <div className="line"></div>
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="circle">{step > 1 ? <i className="checkmark">✓</i> : ''}</div>
            <div>Продукт</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="circle">{step > 2 ? <i className="checkmark">✓</i> : ''}</div>
            <div>Выбор тестов</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="circle">{step > 3 ? <i className="checkmark">✓</i> : ''}</div>
            <div>Оплата</div>
          </div>
        </div>

        {step === 1 && (
          <div className="content active" id="step-1">
            <h3>Детали продукта</h3>
            <div className="product-details">
              <h5 className="card-title">{product.title}</h5>
              <p className="card-text">Время: {product.time} мин</p>
              <p className="card-text">{product.sum} ₸</p>
              <h6 className="card-subtitle mb-2 text-muted">Обязательные предметы:</h6>
              <ul>
                <li>Математическая грамотность</li>
                <li>Грамотность чтения</li>
                <li>История Казахстана</li>
              </ul>
            </div>
            <div className="button-container">
              <button className="next-button" onClick={handleNextStep}>Далее</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="content active" id="step-2">
            <h3>Выберите тесты</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tests">Выберите предметы</label>
                <div className="checkbox-group">
                  {tests.length > 0 ? (
                    tests.map((test: any) => (
                      <div key={test.id} className="form-check">
                        <input
                          type="checkbox"
                          id={`test-${test.id}`}
                          value={test.id}
                          className="form-check-input"
                          onChange={handleTestChange}
                        />
                        <label htmlFor={`test-${test.id}`} className="form-check-label">
                          {test.title}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>No tests available for this product.</p>
                  )}
                </div>
              </div>
              <div className="button-container">
                <button className="prev-button" type="button" onClick={handlePrevStep}>Назад</button>
                <button className="next-button" type="submit">Начать</button>
              </div>
            </form>
            {error && <p className="mt-3 text-danger">{error}</p>}
            <p className="mt-3 text-danger">
              При нажатии на кнопку Начать с вашего счета снимется {product.sum} ₸
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
