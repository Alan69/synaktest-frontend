import React from 'react';
import { Link } from 'react-router-dom';
import useTabs from '../../../hooks/useTabs';
import { useFetchProductsQuery } from '../../../redux/api/productsAPI';

const Pricing = () => {
  const [activeTab, handleTab] = useTabs();

  // @ts-ignore
  const { data: products = [], isLoading, isError } = useFetchProductsQuery()

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Произошла ошибка при получении данных!</div>;
  }

  return (
    <>
      <section className='pricing-section'>
        <div className='pb-20 xl:pb-[150px] '>
          <div className='global-container'>
            <div className='jos mb-10 text-center lg:mb-12'>
              <div className='mx-auto md:max-w-xs lg:max-w-xl xl:max-w-[746px]'>
                <h2>Какие решения мы предоставляем</h2>
              </div>
            </div>
            <div className='container mx-auto'>
              <div
                className='jos flex justify-center'
                data-jos_animation='fade'
              >
                {/* <div className='inline-flex space-x-4 rounded-[50px] border-2 border-[#2124B1] font-semibold'>
                  <button
                    className={`tab-button price-button ${
                      activeTab === 0 ? 'active' : ''
                    }`}
                    onClick={() => handleTab(0)}
                    data-tab='monthly'
                  >
                    Для школьников
                  </button>
                  <button
                    className={`tab-button price-button ${
                      activeTab === 1 ? 'active' : ''
                    }`}
                    onClick={() => handleTab(1)}
                    data-tab='annually'
                  >
                    Для учителей
                  </button>
                </div> */}
              </div>
              <div className='mt-12 lg:mt-16 xl:mt-20'>
                {activeTab === 0 && (
                  <ul
                    id='monthly'
                    className='tab-content grid grid-cols-1 gap-6 md:grid-cols-2 xxl:grid-cols-3'
                  >
                    {products.map((product: any) => (
                      <li
                        key={product.id}
                        className='jos group flex flex-col rounded-[10px] bg-[#f1f5f9] p-10 transition-all duration-300 ease-linear hover:bg-[#2124B1]'
                        data-jos_animation='flip'
                        data-jos_delay='0'
                      >
                        <h3 className='font-dmSans text-[28px] font-bold leading-[1.28] tracking-tighter text-black transition-all duration-300 ease-linear group-hover:text-white'>
                          {product.title}
                        </h3>
                        <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                        <h4 className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                          {product.sum}₸
                          <span className='text-lg font-semibold'>/один тест</span>
                        </h4>
                        <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                          Отлично подходит для тех кто сдает {product.title}
                        </p>
                        <Link
                          to={`/product/${product.id}`}
                          className='button mt-auto block rounded-[50px] border-2 border-[#2124B1] bg-transparent py-4 text-center text-[#2124B1] transition-all duration-300 ease-linear after:bg-[#2124B1] hover:border-[#2124B1] hover:text-black group-hover:border-[#2124B1] group-hover:text-white'
                        >
                          Оплатить
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 1 && (
                  <ul
                    id='annually'
                    className='tab-content grid grid-cols-1 gap-6 md:grid-cols-2 xxl:grid-cols-3'
                  >
                    {products.map((product: any) => (
                      <li
                        key={product.id}
                        className='jos group flex flex-col rounded-[10px] bg-[#f1f5f9] p-10 transition-all duration-300 ease-linear hover:bg-[#2124B1]'
                        data-jos_animation='flip'
                        data-jos_delay='0'
                      >
                        <h3 className='font-dmSans text-[28px] font-bold leading-[1.28] tracking-tighter text-black transition-all duration-300 ease-linear group-hover:text-white'>
                          {product.title}
                        </h3>
                        <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                        <h4 className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                          {product.sum}₸
                          <span className='text-lg font-semibold'>/один тест</span>
                        </h4>
                        <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                          Отлично подходит для тех кто сдает {product.title}
                        </p>
                        <Link
                          to={`/product/${product.id}`}
                          className='button mt-auto block rounded-[50px] border-2 border-[#2124B1] bg-transparent py-4 text-center text-[#2124B1] transition-all duration-300 ease-linear after:bg-[#2124B1] hover:border-[#2124B1] hover:text-black group-hover:border-[#2124B1] group-hover:text-white'
                        >
                          Оплатить
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
