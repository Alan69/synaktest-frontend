import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, message } from 'antd';
import Logo from '../logo/Logo';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { authActions } from 'modules/auth/redux/slices/authSlice';

import styles from './Header.module.scss'
import Navbar from 'components/Navbar/Navbar';

const { Header: AntHeader } = Layout;

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
    <AntHeader className={styles.header}>
      <Logo />
      <Navbar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      <div className='flex items-center gap-6'>
        {!token ? (
          <>
            <Link to='/login' className='button hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-colorMainPurple hover:border-colorMainPurple hover:text-white lg:inline-block'>Войти</Link>
            <Link to='/signup' className='button hidden rounded-[50px] border-black bg-black text-white after:bg-colorMainPurple hover:border-colorMainPurple hover:text-white lg:inline-block'>Регистрация</Link>
          </>
        ) : (
          <>
            {!user?.test_is_started ?
              <button
                onClick={handleLogout}
                className='button hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-colorMainPurple hover:border-colorMainPurple hover:text-white lg:inline-block'>
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
    </AntHeader >
  );
};

export default Header;
