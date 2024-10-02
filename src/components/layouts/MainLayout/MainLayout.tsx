import { Outlet, useLocation } from 'react-router-dom';
import Footer from 'components/footer/Footer';
import Header from 'components/header/Header';
import styles from './MainLayout.module.scss'

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className='page-wrapper relative z-[1] bg-white'>
      <Header />
      <main className={styles.mainLayout}>
        <Outlet />
      </main>
      {location.pathname.includes('product') ? '' : <Footer />}
    </div>
  );
};

export default MainLayout;
