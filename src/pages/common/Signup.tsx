import { useState } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import iconWhiteCheckmarkFilled from '../../assets/img/th-1/icon-white-checkmark-filled.svg';
import { useSignUpMutation } from 'modules/auth/redux/api';
import { Form, message } from 'antd';
import { useDispatch } from 'react-redux';
import { authActions } from 'modules/auth/redux/slices/authSlice';

const Signup = () => {
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    check: false,
  });

  const [signUp, { isLoading }] = useSignUpMutation();

  const handleInput = (e: any) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckBox = (value: any) => {
    setInput((prev) => ({ ...prev, check: value }));
  };

  const onFinish = async (values: { email: string; password: string; password2: string }) => {
    if (values.password !== values.password2) {
      message.error('Пароли не совпадают!');
      return;
    }

    try {
      const response = await signUp({ ...values, first_name: 'Имя', last_name: 'Фамилия' });
      // @ts-ignore
      const { access: token, refresh: refreshToken } = response.data;

      dispatch(authActions.setToken({ token, refreshToken }));
      message.success('Регистрация успешна! Пожалуйста, войдите в систему.');
    } catch (error) {
      message.error('Ошибка регистрации. Пожалуйста, проверьте введенные данные.');
    }
  };

  return (
    <main className='main-wrapper relative overflow-hidden'>
      <section id='signup-section'>
        <div className='py-40 pt-36 xl:pb-[200px] xl:pt-[180px]'>
          <div className='global-container'>
            <div className='mx-auto max-w-[910px] text-center'>
              <h1 className='mb-[50px]'>Создать аккаунт</h1>
              <div className='block rounded-lg bg-white px-[30px] py-[50px] text-left shadow-[0_4px_60px_0_rgba(0,0,0,0.1)] sm:px-10'>
                <Form onFinish={onFinish} className='flex flex-col gap-y-5'>
                  <div className='grid grid-cols-1 gap-6'>
                    <div className='flex flex-col gap-y-[10px]'>
                      <label htmlFor='signup-username' className='text-lg font-bold leading-[1.6]'>
                        Логин
                      </label>
                      <input
                        type='text'
                        name='username'
                        value={input.username}
                        onChange={handleInput}
                        id='signup-username'
                        placeholder='Введите логин'
                        className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-y-[10px]'>
                      <label htmlFor='signup-email' className='text-lg font-bold leading-[1.6]'>
                        Почта
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={input.email}
                        onChange={handleInput}
                        id='signup-email'
                        placeholder='example@gmail.com'
                        className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-y-[10px]'>
                      <label htmlFor='signup-first_name' className='text-lg font-bold leading-[1.6]'>
                        Имя
                      </label>
                      <input
                        type='text'
                        name='first_name'
                        value={input.first_name}
                        onChange={handleInput}
                        id='signup-first_name'
                        placeholder='Введите имя'
                        className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-y-[10px]'>
                      <label htmlFor='signup-last_name' className='text-lg font-bold leading-[1.6]'>
                        Фамилия
                      </label>
                      <input
                        type='text'
                        name='last_name'
                        value={input.last_name}
                        onChange={handleInput}
                        id='signup-last_name'
                        placeholder='Введите фамилию'
                        className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-y-[10px]'>
                      <label htmlFor='signup-password' className='text-lg font-bold leading-[1.6]'>
                        Пароль
                      </label>
                      <input
                        type='password'
                        name='password'
                        value={input.password}
                        onChange={handleInput}
                        id='signup-password'
                        placeholder='............'
                        className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        required
                      />
                    </div>
                    <div className='flex gap-x-8 gap-y-[10px]'>
                      <input
                        type='checkbox'
                        className="relative appearance-none after:absolute after:left-0 after:top-[6px] after:h-4 after:w-4 after:rounded-[3px] after:border after:border-[#7F8995] after:bg-white after:text-white after:transition-all after:delay-300 checked:after:border-colorOrangyRed checked:after:bg-colorOrangyRed"
                        style={{
                          backgroundImage: `url(${iconWhiteCheckmarkFilled})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundSize: 'contain',
                        }}
                        name='check'
                        checked={input.check}
                        onChange={() => handleCheckBox(!input.check)}
                        id='signup-check'
                        required
                      />
                      <label htmlFor='signup-check' className='text-base leading-[1.6]'>
                        Я прочитал и ознакомился с
                        <Link to='#' className='font-bold hover:text-colorOrangyRed'>
                          Правилами
                        </Link>
                      </label>
                    </div>
                  </div>
                  <button
                    type='submit'
                    className='button mt-7 block rounded-[50px] border-2 border-black bg-black py-4 text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white'
                    disabled={isLoading} // Делаем кнопку недоступной во время загрузки
                  >
                    {isLoading ? 'Регистрация...' : 'Создать аккаунт'}
                  </button>
                </Form>
                <div className='mt-10 text-center'>
                  Уже есть аккаунт? &nbsp;
                  <Link to='/login' className='text-base font-semibold hover:text-colorOrangyRed'>
                    Войти
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup;
