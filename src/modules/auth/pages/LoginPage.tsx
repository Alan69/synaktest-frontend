import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from 'modules/auth/redux/api';
import { useDispatch } from 'react-redux';
import { Form, Input, message } from 'antd';
import { authActions } from 'modules/auth/redux/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation(); // Используем RTK Query хук

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const response = await login(values)

      // @ts-ignore
      const { access: token, refresh: refreshToken } = response.data;

      dispatch(authActions.setToken({ token, refreshToken }));
      navigate('/home');
      message.success('Login successful!');

    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <main className='main-wrapper relative overflow-hidden'>
      <section id='login-section'>
        <div className='py-40 pt-36 xl:pb-[200px] xl:pt-[180px]'>
          <div className='global-container'>
            <div className='mx-auto max-w-[910px] text-center'>
              <h1 className='mb-[50px]'>Добро пожаловать</h1>
              <div className='block rounded-lg bg-white px-[30px] py-[50px] text-left shadow-[0_4px_60px_0_rgba(0,0,0,0.1)] sm:px-10'>
                <Form name="login_form" initialValues={{ remember: true }} onFinish={onFinish} className='flex flex-col gap-y-5'>
                  <div className='grid grid-cols-1 gap-6'>
                    <Form.Item
                      name="username"
                      rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
                    >
                      <div className='flex flex-col gap-y-[10px]'>
                        <label htmlFor='login-username' className='text-lg font-bold leading-[1.6]'>
                          Логин
                        </label>
                        <Input
                          type='text'
                          placeholder='Введите логин'
                          className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        />
                      </div>

                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
                    >
                      <div className='flex flex-col gap-y-[10px]'>
                        <label htmlFor='login-password' className='text-lg font-bold leading-[1.6]'>
                          Пароль
                        </label>
                        <Input.Password
                          type='password'
                          placeholder='Пароль'
                          className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        />
                      </div>

                    </Form.Item>

                    <Form.Item>
                      <button
                        type="submit"
                        className='button w-full justify-center rounded-[50px] border-2 border-black bg-black text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white'
                        disabled={isLoading}
                      >
                        {isLoading ? 'Вход...' : 'Войти'}
                      </button>
                    </Form.Item>

                    <div className='flex flex-wrap justify-between gap-x-10 gap-y-4'>
                      <Link to='/reset-password' className='text-base hover:text-colorOrangyRed'>
                        Забыли пароль?
                      </Link>
                    </div>
                  </div>

                  <div className='text-center'>
                    Нет аккаунта? &nbsp;
                    <Link to='/signup' className='text-base font-semibold hover:text-colorOrangyRed'>
                      Зарегистрироваться
                    </Link>
                  </div>
                </Form>

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
