import React, { useState, useEffect, useRef, createContext, useCallback } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import useJOSAnimation from './hooks/useJOSAnimation';
import Home from 'pages/home/Home';
import { useLazyGetAuthUserQuery } from 'modules/user/redux/slices/api';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { message } from 'antd';
import { CompletedTestDetailsPage } from 'modules/competed-test/pages/CompletedTestDetailsPage/CompletedTestDetailsPage';
import { TQuestion, TTest, useCompleteTestMutation } from 'modules/product/redux/api';
import { CompletedTestListPage } from './modules/competed-test/pages/CompletedTestListPage/CompletedTestListPage';
import ProfilePage from 'modules/user/pages/ProfilePage';
import { UnauthorisedLayout } from 'layouts/UnauthorisedLayout/UnauthorisedLayout';
import MainLayout from 'layouts/MainLayout/MainLayout';
import SignUpPage from 'modules/auth/pages/SignUpPage';
import ForgotPasswordPage from 'modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from 'modules/auth/pages/ResetPasswordPage';
import { ProductListPage } from 'modules/product/pages/ProductListPage/ProductListPage';
import ProductDetailsPageNew from 'modules/product/pages/ProductDetailsPageNew/ProductDetailsPageNew';

export const TimerContext = createContext<{
  timeLeft: number;
  formatTime: (seconds: number) => string;
  testIsStarted: boolean;
  timerInitialized: boolean;
  handleCompleteTest?: () => Promise<void>;
  isCompleting: boolean;
  resetTimer: () => void;
} | null>(null);

function App() {
  useJOSAnimation();
  const location = useLocation();
  const navigate = useNavigate();
  const [getAuthUser] = useLazyGetAuthUserQuery();
  const { token, user } = useTypedSelector((state) => state.auth);
  const [completeTest, { isLoading: isCompleting }] = useCompleteTestMutation();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [testIsStarted, setTestIsStarted] = useState<boolean>(false);
  const [timerInitialized, setTimerInitialized] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleCompleteTest = useCallback(async () => {
    try {
      localStorage.setItem('completing_test', 'true');
      
      const serializedTests = localStorage.getItem('test');
      const selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers') || '{}');
      const productId = localStorage.getItem('product_id');

      if (!serializedTests) {
        message.error('Не удалось найти информацию о тестах.');
        return;
      }

      const parsedTests = JSON.parse(serializedTests);

      const tests: TTest[] = parsedTests.map((test: TTest) => ({
        id: test.id,
        questions: test.questions.map((question: TQuestion) => ({
          id: question.id,
          option_id: selectedAnswers[question.id] || null,
        })),
      }));

      const completeTestRequest = {
        product_id: productId,
        tests,
      };

      message.loading('Отправка результатов теста...', 0);

      // @ts-ignore
      const response = await completeTest(completeTestRequest).unwrap();

      message.destroy();

      if (response) {
        message.success('Тест успешно завершен.');
        
        // Set a flag in sessionStorage to indicate we just completed a test
        sessionStorage.setItem('test_just_completed', 'true');
        
        // Clear all test-related localStorage items
        localStorage.removeItem('completing_test');
        localStorage.removeItem('test');
        localStorage.removeItem('selectedAnswers');
        localStorage.removeItem('product_id');
        localStorage.removeItem('testIsStarted');
        localStorage.removeItem('remainingTime');
        localStorage.removeItem('testTime');
        localStorage.removeItem('questionIndices');
        
        // Clear timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Reset timer state
        setTimeLeft(0);
        setTestIsStarted(false);
        
        // Navigate to results page
        navigate(`/completed-test/${response.completed_test_id}`);
      } else {
        message.error('Не удалось завершить тест.');
      }
    } catch (error) {
      console.error('Error completing test:', error);
      message.error('Произошла ошибка при завершении теста. Пожалуйста, попробуйте еще раз.');
    }
  }, [completeTest, navigate]);

  const startTimer = useCallback(() => {
    // Always clear any existing interval before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Simple countdown timer that decrements by 1 second each time
    intervalRef.current = setInterval(() => {
      // Get the current time from localStorage to ensure we're always using the latest value
      const currentTime = parseInt(localStorage.getItem('remainingTime') || '0', 10);
      
      if (currentTime <= 0) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        intervalRef.current = null;
        localStorage.removeItem('remainingTime');
        message.warning('Время вышло!');
        handleCompleteTest();
        return;
      }
      
      // Decrement by 1 second
      const newTime = currentTime - 1;
      
      // Always update localStorage first
      localStorage.setItem('remainingTime', newTime.toString());
      
      // Then update React state
      setTimeLeft(newTime);
      
      // Log every minute for debugging
      if (newTime % 60 === 0) {
        console.log(`Timer: ${formatTime(newTime)}`);
      }
    }, 1000);
    
    console.log('Timer started with interval ID:', intervalRef.current);
  }, [handleCompleteTest]);

  // Initialize timer on mount or when test status changes
  useEffect(() => {
    if (timerInitialized && testIsStarted) {
      const remainingTime = parseInt(localStorage.getItem('remainingTime') || '0', 10);
      
      if (remainingTime > 0) {
        console.log(`Initializing timer with ${formatTime(remainingTime)}`);
        setTimeLeft(remainingTime);
        startTimer();
      } else {
        // If no remaining time but test is started, initialize from testTime
        const testTime = localStorage.getItem('testTime');
        if (testTime) {
          const initialSeconds = parseInt(testTime, 10) * 60;
          localStorage.setItem('remainingTime', initialSeconds.toString());
          setTimeLeft(initialSeconds);
          console.log(`No remaining time found, setting initial time to ${formatTime(initialSeconds)}`);
          startTimer();
        }
      }
    }
    
    return () => {
      if (intervalRef.current) {
        console.log('Cleaning up timer interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [testIsStarted, timerInitialized, startTimer]);

  // Function to completely reset the timer
  const resetTimer = useCallback(() => {
    console.log('Reset timer called');
    
    // Clear existing timer interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Get the test time from localStorage
    const newTestTime = localStorage.getItem('testTime');
    if (newTestTime) {
      const newTimeInSeconds = parseInt(newTestTime, 10) * 60;
      console.log(`Resetting timer to ${formatTime(newTimeInSeconds)}`);
      
      // Reset the remaining time in localStorage
      localStorage.setItem('remainingTime', newTimeInSeconds.toString());
      
      // Update the timeLeft state with the new value
      setTimeLeft(newTimeInSeconds);
      
      // Start the timer
      setTimeout(() => {
        startTimer();
      }, 100);
    } else {
      // If no test time is set, reset to 0
      setTimeLeft(0);
      localStorage.removeItem('remainingTime');
    }
  }, [startTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!token) {
      localStorage.clear()
    } else {
      getAuthUser();
    }
  }, [token, navigate, getAuthUser, location.pathname]);

  useEffect(() => {
    // Check if the user was in the middle of completing a test
    const completingTest = localStorage.getItem('completing_test');
    
    if (completingTest === 'true' && !isCompleting) {
      // Show a message that they should try completing the test again
      message.warning(
        'Похоже, что ваш предыдущий тест не был корректно завершен. Пожалуйста, попробуйте завершить тест снова.',
        10
      );
    }
  }, []);

  // Load initial test state and timer data on mount
  useEffect(() => {
    const savedTestIsStarted = localStorage.getItem('testIsStarted');
    if (savedTestIsStarted) {
      setTestIsStarted(JSON.parse(savedTestIsStarted));
    }
    
    // Initialize the timer state
    setTimerInitialized(true);
    
    // Monitor localStorage changes (for cross-tab consistency)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'testTime' && e.newValue) {
        console.log('Test time changed in another tab, resetting timer');
        resetTimer();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [resetTimer]);

  if (!token) {
    return (
      <Routes>
        <Route element={<UnauthorisedLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='*' element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  }

  if (location.pathname === '/') {
    navigate('/home');
  }

  return (
    <TimerContext.Provider value={{ 
      timeLeft, 
      formatTime, 
      testIsStarted, 
      timerInitialized, 
      handleCompleteTest, 
      isCompleting,
      resetTimer 
    }}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/profile/personal-info' element={<ProfilePage />} />
          <Route path='/profile/update-password' element={<ProfilePage />} />
          <Route path='/profile/balance' element={<ProfilePage />} />
          <Route path='/profile/referral' element={<ProfilePage />} />
          <Route path="/product/list" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailsPageNew />} />
          <Route path="/completed-test/list" element={<CompletedTestListPage />} />
          <Route path="/completed-test/:id" element={<CompletedTestDetailsPage />} />
          <Route path='*' element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </TimerContext.Provider>
  );
}

export default App;
