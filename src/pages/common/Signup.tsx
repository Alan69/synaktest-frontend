import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignUpMutation } from 'modules/auth/redux/api';
import { Form, Input, Checkbox, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { authActions } from 'modules/auth/redux/slices/authSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const [signUp, { isLoading }] = useSignUpMutation();

  const onFinish = async (values: any) => {
    if (values.password !== values.password2) {
      message.error('Пароли не совпадают!');
      return;
    }

    try {
      const response = await signUp(values);
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
                <Form
                  onFinish={onFinish}
                  className='flex flex-col gap-y-5'
                  layout="vertical"
                  requiredMark={false}
                >
                  <Form.Item
                    name="username"
                    label="Логин"
                    rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
                  >
                    <Input
                      placeholder="Введите логин"
                      className='rounded-[10px] px-6 py-[18px]'
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Почта"
                    rules={[
                      { required: true, message: 'Пожалуйста, введите почту!' },
                      { type: 'email', message: 'Введите корректный email!' },
                    ]}
                  >
                    <Input
                      placeholder="example@gmail.com"
                      className='rounded-[10px] px-6 py-[18px]'
                    />
                  </Form.Item>

                  <Form.Item
                    name="first_name"
                    label="Имя"
                    rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
                  >
                    <Input
                      placeholder="Введите имя"
                      className='rounded-[10px] px-6 py-[18px]'
                    />
                  </Form.Item>

                  <Form.Item
                    name="last_name"
                    label="Фамилия"
                    rules={[{ required: true, message: 'Пожалуйста, введите фамилию!' }]}
                  >
                    <Input
                      placeholder="Введите фамилию"
                      className='rounded-[10px] px-6 py-[18px]'
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
                  >
                    <Input.Password
                      placeholder="............"
                      className='rounded-[10px] px-6 py-[18px]'
                    />
                  </Form.Item>

                  <Form.Item
                    name="password2"
                    label="Подтвердите пароль"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      { required: true, message: 'Пожалуйста, подтвердите пароль!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Пароли не совпадают!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="............"
                      className='rounded-[10px] px-6 py-[18px]'
                    />
                  </Form.Item>

                  {/* <Form.Item
                    name="check"
                    valuePropName="checked"
                    rules={[{ required: true, message: 'Вы должны принять условия!' }]}
                  >
                    <Checkbox>
                      Я прочитал и ознакомился с{' '}
                      <Link to="#" className="font-bold hover:text-colorOrangyRed">
                        Правилами
                      </Link>
                    </Checkbox>
                  </Form.Item> */}

                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ height: 'auto' }}
                    className='button mt-7 block rounded-[50px] border-2 border-black bg-black py-4 text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white'
                    loading={isLoading}
                  >
                    {isLoading ? 'Регистрация...' : 'Создать аккаунт'}
                  </Button>
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
