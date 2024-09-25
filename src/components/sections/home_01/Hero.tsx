import { Link } from 'react-router-dom';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';

const Hero = () => {
  return (
    <>
      <section id='section-hero'>
        <div className='relative z-[1] overflow-hidden rounded-bl-[30px] rounded-br-[30px] bg-colorLinenRuffle pb-20 pt-28 lg:rounded-bl-[50px] lg:rounded-br-[50px] lg:pb-24 lg:pt-32 xl:pt-40 xxl:pb-[133px] xxl:pt-[195px]'>
          <div className='global-container'>
            <div className='mb-14 flex flex-col items-center text-center lg:mb-20'>
              <h1 className='jos slide-from-bottom mb-6 max-w-[510px] lg:max-w-[768px] xl:max-w-[1076px]'>
                Лучшая платформа для онлайн-обучения
              </h1>
              <p className='jos slide-from-bottom mb-11 max-w-[700px] text-lg font-semibold sm:text-xl xl:max-w-[980px]'>
                Synaqtest — это образовательная компания, которая использует ИИ в тестах, чтобы помочь людям эффективно учиться. Мы предоставляем самые передовые технологии и лучшие решения для обучения.
              </p>
              <div className='jos flex flex-wrap justify-center gap-6' data-jos_animation='fade'>
                <Link
                  to='/payment'
                  className='button rounded-[50px] border-2 border-[#2124B1] bg-[#2124B1] py-4 text-white after:bg-[#2124B1] hover:border-[#2124B1] hover:text-white'
                >
                  Попробовать
                </Link>
                {/* <Link
                  to='/about'
                  className='button rounded-[50px] border-2 border-[#2124B1] bg-transparent py-4 text-black after:bg-[#2124B1] hover:border-[#2124B1] hover:text-white'
                >
                  Узнать больше
                </Link> */}
              </div>
            </div>
            {/* <div className='jos hero-img overflow-hidden rounded-2xl bg-black' data-jos_animation='zoom'>
              <img
                src='assets/img/th-1/q.gif'
                alt='hero-dashboard'
                width='1296'
                height='640'
                className='h-auto w-full'
              />
            </div> */}
            {/* <div className='my-10 h-[1px] w-full bg-[#DBD6CF] lg:my-16 xl:my-20'></div>
            <div className='jos brand-slider' data-jos_animation='fade'>
              <Swiper
                slidesPerView={2}
                spaceBetween={105}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                breakpoints={{
                  768: {
                    slidesPerView: 3,
                  },
                  992: {
                    slidesPerView: 4,
                  },
                  1200: {
                    slidesPerView: 5,
                  },
                }}
              >
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-1.png'
                    alt='brand-1'
                    width='180'
                    height='38'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-2.png'
                    alt='brand-2'
                    width='183'
                    height='35'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-3.png'
                    alt='brand-3'
                    width='172'
                    height='35'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-4.png'
                    alt='brand-4'
                    width='175'
                    height='30'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-5.png'
                    alt='brand-5'
                    width='168'
                    height='36'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-1.png'
                    alt='brand-1'
                    width='180'
                    height='38'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-2.png'
                    alt='brand-2'
                    width='183'
                    height='35'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-3.png'
                    alt='brand-3'
                    width='172'
                    height='35'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-4.png'
                    alt='brand-4'
                    width='175'
                    height='30'
                    className='max-w-full'
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src='assets/img/th-1/brand-5.png'
                    alt='brand-5'
                    width='168'
                    height='36'
                    className='max-w-full'
                  />
                </SwiperSlide>
              </Swiper>
            </div> */}
          </div>
          <div className='blue-gradient-1 absolute -right-[150px] top-[370px] -z-[1] h-[500px] w-[500px] animate-spin rounded-[500px]'></div>
          <div className='blue-gradient-2 absolute right-[57px] top-[620px] -z-[1] h-[450px] w-[450px] animate-spin rounded-[450px]'></div>
        </div>
      </section>
    </>
  );
};

export default Hero;
