import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Logo from '../logo/Logo';
import { useLogoutMutation } from '../../redux/api/authAPI';

// @ts-ignore
const Header = ({ loginCSS, signupCSS, navColor, light }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const [logout, { isLoading, isSuccess, isError }] = useLogoutMutation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh');

    if (!refreshToken) {
      console.error('No refresh token found.');
      alert('Вы не авторизованы. Пожалуйста, войдите.');
      navigate('/login');
      return;
    }

    try {
      const result = await logout(refreshToken);

      if (result.data && result.data.status === 205) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        console.error('Unexpected response:', result);
        alert('Произошла ошибка при выходе.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // @ts-ignore
      alert(`Произошла ошибка при выходе: ${error.response?.data || error.message}`);
    }
  };

  return (
    <header className='site-header site-header--absolute is--white py-3' id='sticky-menu'>
      <div className='global-container'>
        <div className='flex items-center justify-between gap-x-8'>
          <Logo light={light} />
          <Navbar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} color={navColor} />
          <div className='flex items-center gap-6'>
            {!isAuthenticated ? (
              <>
                <Link to='/login' className={loginCSS}>Войти</Link>
                <Link to='/signup' className={signupCSS}>Регистрация</Link>
              </>
            ) : (
              <button onClick={handleLogout} className={loginCSS} disabled={isLoading}>
                {isLoading ? 'Выход...' : 'Выйти'}
              </button>
            )}
            <div className='block lg:hidden'>
              <button
                onClick={() => setMobileMenu(true)}
                className={`mobile-menu-trigger ${light ? 'is-white' : 'is-black'}`}
              >
                <span />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
