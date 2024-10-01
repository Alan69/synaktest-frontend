import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../logo/Logo';
import Navbar from '../navbar/Navbar';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { authActions } from 'modules/auth/redux/slices/authSlice';
import { message } from 'antd';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useTypedSelector((state) => state.auth);

  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = async () => {
    dispatch(authActions.logOut());
    navigate('/home');
    message.success('Logout successful!');
  };

  return (
    <header className='site-header site-header--absolute is--white py-3' id='sticky-menu'>
      <div className='global-container'>
        <div className='flex items-center justify-between gap-x-8'>
          <Logo />
          <Navbar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
          <div className='flex items-center gap-6'>
            {!token ? (
              <>
                <Link to='/login' className='button hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white lg:inline-block'>Войти</Link>
                <Link to='/signup' className='button hidden rounded-[50px] border-black bg-black text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white lg:inline-block'>Регистрация</Link>
              </>
            ) : (
              <>
                {!user?.test_is_started ?
                  <button
                    onClick={handleLogout}
                    className='button hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white lg:inline-block'>
                    Выйти
                  </button> : ''
                }
              </>
            )}
            <div className='block lg:hidden'>
              <button
                onClick={() => setMobileMenu(true)}
                className={`mobile-menu-trigger 'is-white'}`}
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
