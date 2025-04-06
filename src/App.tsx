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

  // Function to completely reset the timer
  const resetTimer = useCallback(() => {
    // Clear existing timer interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Get the new test time from localStorage
    const newTestTime = localStorage.getItem('testTime');
    if (newTestTime) {
      const newTimeInSeconds = parseInt(newTestTime, 10) * 60;
      // Update the timeLeft state with the new value
      setTimeLeft(newTimeInSeconds);
      // Reset the remaining time in localStorage
      localStorage.setItem('remainingTime', newTimeInSeconds.toString());
      console.log('Timer reset to', newTimeInSeconds, 'seconds');
    } else {
      // If no test time is set, reset to 0
      setTimeLeft(0);
      localStorage.removeItem('remainingTime');
    }
  }, []);

  // Monitor for test time changes to reset the timer
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'testTime' && e.newValue) {
        console.log('Test time changed in storage, resetting timer');
        resetTimer();
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on component mount
    const testTime = localStorage.getItem('testTime');
    const savedTestIsStarted = localStorage.getItem('testIsStarted');
    
    if (testTime && savedTestIsStarted === 'true') {
      console.log('Found test time on load, initializing timer');
      resetTimer();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [resetTimer]);

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

  useEffect(() => {
    const savedTestIsStarted = localStorage.getItem('testIsStarted');
    const savedTime = localStorage.getItem('remainingTime');

    if (savedTestIsStarted) {
      setTestIsStarted(JSON.parse(savedTestIsStarted));
    }

    if (savedTime && JSON.parse(savedTestIsStarted || 'false')) {
      setTimeLeft(parseInt(savedTime, 10));
    } else {
      const initialTime = localStorage.getItem('testTime');
      if (initialTime && JSON.parse(savedTestIsStarted || 'false')) {
        const initialTimeInSeconds = parseInt(initialTime, 10) * 60;
        setTimeLeft(initialTimeInSeconds);
        localStorage.setItem('remainingTime', initialTimeInSeconds.toString());
      }
    }

    setTimerInitialized(true);
  }, []);

  const startTimer = useCallback(() => {
    if (testIsStarted && timeLeft > 0) {
      // Always clear any existing interval before starting a new one
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Get the current timestamp to track when we started
      const startTimestamp = Date.now();
      const initialTimeLeft = timeLeft;
      
      // Start a new interval
      intervalRef.current = setInterval(() => {
        // Calculate elapsed time since timer started
        const elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
        const calculatedTimeLeft = Math.max(0, initialTimeLeft - elapsedSeconds);
        
        // Store in localStorage
        localStorage.setItem('remainingTime', calculatedTimeLeft.toString());
        
        // Update state if it's different
        if (calculatedTimeLeft !== timeLeft) {
          setTimeLeft(calculatedTimeLeft);
        }
        
        // If time's up
        if (calculatedTimeLeft <= 0) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          intervalRef.current = null;
          localStorage.removeItem('remainingTime');
          message.warning('Время вышло!');
          handleCompleteTest();
        }
      }, 1000);
      
      console.log('Timer started with', timeLeft, 'seconds remaining');
    }
  }, [testIsStarted, timeLeft, handleCompleteTest]);

  useEffect(() => {
    if (timerInitialized && testIsStarted && timeLeft > 0) {
      startTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [testIsStarted, timerInitialized, startTimer]);

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

  // Add a watchdog timer to ensure the main timer is running properly
  useEffect(() => {
    if (testIsStarted && timeLeft > 0 && timerInitialized) {
      // Create a watchdog timer that checks every 10 seconds if the main timer is running
      const watchdogTimer = setInterval(() => {
        const now = Date.now();
        const lastTimerCheck = parseInt(localStorage.getItem('lastTimerCheck') || '0', 10);
        const currentTimeLeft = parseInt(localStorage.getItem('remainingTime') || '0', 10);
        
        // Store the current check time and timeLeft
        localStorage.setItem('lastTimerCheck', now.toString());
        
        // If more than 20 seconds passed and timeLeft hasn't changed, timer might be stuck
        if (lastTimerCheck > 0 && (now - lastTimerCheck) > 20000 && timeLeft === currentTimeLeft) {
          console.warn('Timer appears to be stuck, attempting to restart...');
          // Force restart by clearing interval and calling startTimer
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          startTimer();
        }
      }, 10000);
      
      return () => clearInterval(watchdogTimer);
    }
  }, [testIsStarted, timeLeft, timerInitialized, startTimer]);

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
