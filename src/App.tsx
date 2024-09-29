import React, { useState, useEffect, useRef, createContext } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import Signup from './pages/common/Signup';
import useJOSAnimation from './hooks/useJOSAnimation';
import Profile from './pages/common/Profile';
import Payment from './pages/common/Payment';
import Test from './pages/common/Test';
import Quiz from './pages/tests_logic/Quiz';
import Home from 'pages/home/Home';
import ResetPassword from 'pages/common/ResetPassword';
import ProductDetailsPage from 'modules/product/pages/ProductDetailsPage/ProductDetailsPage';
import { useLazyGetAuthUserQuery } from 'modules/user/redux/slices/api';
import { useTypedSelector } from 'hooks/useTypedSelector';
import MainLayout from 'components/layouts/MainLayout/MainLayout';
import { UnauthorisedLayout } from 'components/layouts/UnauthorisedLayout/UnauthorisedLayout';
import { message } from 'antd';

export const TimerContext = createContext<{
  timeLeft: number;
  formatTime: (seconds: number) => string;
  testIsStarted: boolean;
  timerInitialized: boolean; // Добавляем состояние инициализации таймера
} | null>(null);

function App() {
  useJOSAnimation();
  const location = useLocation();
  const navigate = useNavigate();
  const [getAuthUser] = useLazyGetAuthUserQuery();
  const { token } = useTypedSelector((state) => state.auth);

  // Таймер и состояние теста
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [testIsStarted, setTestIsStarted] = useState<boolean>(false);
  const [timerInitialized, setTimerInitialized] = useState<boolean>(false); // Новое состояние для отслеживания инициализации таймера
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    // После инициализации установим флаг
    setTimerInitialized(true);
  }, []);

  const startTimer = () => {
    if (testIsStarted && !intervalRef.current && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const updatedTime = prevTime - 1;
          localStorage.setItem('remainingTime', updatedTime.toString());
          if (updatedTime <= 0) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            intervalRef.current = null;
            message.warning('Время вышло!');
          }
          return updatedTime;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (timerInitialized) {
      startTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timeLeft, testIsStarted, timerInitialized]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!token) {
      // navigate('/login', { replace: true });
    } else {
      getAuthUser();
    }
  }, [token, navigate, getAuthUser, location.pathname]);

  if (!token) {
    return (
      <Routes>
        <Route element={<UnauthorisedLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/reset-password' element={<ResetPassword />} />
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
    <TimerContext.Provider value={{ timeLeft, formatTime, testIsStarted, timerInitialized }}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='profile' element={<Profile />} />
          <Route path='payment' element={<Payment />} />
          <Route path='test' element={<Test />} />
          <Route path="/quiz/:testIds" element={<Quiz />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path='*' element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </TimerContext.Provider>
  );
}

export default App;
