import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetProductListQuery } from 'modules/product/redux/api';
import styles from './ProductList.module.scss';
import { ReactComponent as IconTest } from '../../../../assets/img/icon-test.svg';
import { Spin } from 'antd';

const ProductList = () => {
  const location = useLocation();

  const { data: products, isLoading } = useGetProductListQuery();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className='pricing-section'>
      <div className='pb-20 xl:pb-[150px] '>
        <div className='global-container'>
          <h2 className={styles.title}>Какие решения мы предоставляем</h2>
          <div className={styles.product}>
            {products?.map((product) => (
              <div
                key={product.id}
                className={styles.product__item}
              >
                <div className={styles.product__item__content}>
                  <div className={styles.product__item__descr}>
                    <h3 className={styles.product__item__title}>
                      {product.title}
                    </h3>
                    <div className={styles.product__item__subtitleBlock}>
                      <div className={styles.product__item__subtitle}>{product.sum}₸</div>
                      <div className={styles.divider}></div>
                      <div className={styles.product__item__subtitle}>Один тест</div>
                    </div>
                    <div className={styles.product__item__text}>
                      Отлично подходит для <br /> тех кто сдает {product.title}
                    </div>
                  </div>
                  <IconTest />
                </div>
                <Link
                  to={location.pathname.includes('home') ? '/product/list' : `/product/${product.id}`}
                  className={styles.product__item__button}
                >
                  Оплатить
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section >
  );
};

export default ProductList;
