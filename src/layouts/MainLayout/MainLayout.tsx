import { Outlet, useLocation } from 'react-router-dom';
import styles from './MainLayout.module.scss'
import Header from '../../components/Header/Header';
import Footer from '../../components/footer/Footer';

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
