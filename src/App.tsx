import { Route, Routes } from 'react-router-dom';
import Login from './pages/common/Login';
import Signup from './pages/common/Signup';
import useJOSAnimation from './hooks/useJOSAnimation';
import Layout from './components/layout/Layout';
import Profile from './pages/common/Profile';

import Payment from './pages/common/Payment';
import Test from './pages/common/Test';
import ProductDetail from './pages/tests_logic/ProductDetail';
import Quiz from './pages/tests_logic/Quiz';
import Home from 'pages/home/Home';
import Error404 from 'pages/common/Error404';
import ResetPassword from 'pages/common/ResetPassword';

function App() {
  useJOSAnimation();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup />} />
        <Route path='reset-password' element={<ResetPassword />} />
        <Route path='error-404' element={<Error404 />} />
        <Route path='*' element={<Error404 />} />
        <Route path='profile' element={<Profile />} />
        <Route path='payment' element={<Payment />} />
        <Route path='test' element={<Test />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/quiz/:testIds" element={<Quiz />} />
      </Route>
    </Routes>
  );
}

export default App;
