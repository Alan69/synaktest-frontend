import Footer from 'components/footer/Footer';
import Header from 'components/header/Header';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className='page-wrapper relative z-[1] bg-white'>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      {location.pathname.includes('product') ? '' : <Footer />}
    </div>
  );
};

export default MainLayout;
