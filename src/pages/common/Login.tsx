import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import iconWhiteCheckmarkFilled from '../../assets/img/th-1/icon-white-checkmark-filled.svg';
import { useLoginMutation } from '../../redux/api/authAPI';

const Login = () => {
  const [input, setInput] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation(); // Используем RTK Query хук

  const handleInput = (e: any) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (input.username === '' || input.password === '') {
      swal('Oops', 'Please fill all fields', 'error');
      return;
    }

    try {
      const response = await login(input).unwrap(); // Вызываем RTK Query запрос
      if (response) {
        const token = response.access;
        localStorage.setItem('token', token); // Сохраняем JWT токен в localStorage
        swal('Success', 'Logged in successfully', 'success');
        navigate('/'); // Переход после успешного логина
      }
    } catch (error) {
      // @ts-ignore
      if (error.status === 401) {
        swal('Error', 'Invalid credentials', 'error');
      } else {
        swal('Error', 'Something went wrong. Please try again later.', 'error');
      }
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-y-5'>
                  <div className='grid grid-cols-1 gap-6'>
                    <div className='flex flex-col gap-y-[10px]'>
                      <label htmlFor='login-username' className='text-lg font-bold leading-[1.6]'>
                        Логин
                      </label>
                      <input
                        type='text'
                        name='username'
                        value={input.username}
                        onChange={handleInput}
                        id='login-username'
                        placeholder='Введите логин'
                        className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-y-[10px]'>
                      <label htmlFor='login-password' className='text-lg font-bold leading-[1.6]'>
                        Пароль
                      </label>
                      <input
                        type='password'
                        name='password'
                        value={input.password}
                        onChange={handleInput}
                        id='login-password'
                        placeholder='............'
                        className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                        required
                      />
                    </div>
                    <div className='flex flex-wrap justify-between gap-x-10 gap-y-4'>
                      <div className='flex gap-x-8 gap-y-[10px]'>
                        <input
                          type='checkbox'
                          className="relative appearance-none text-base after:absolute after:left-0 after:top-[6px] after:h-4 after:w-4 after:rounded-[3px] after:border after:border-[#7F8995] after:bg-white after:text-white after:transition-all after:delay-300 checked:after:border-colorOrangyRed checked:after:bg-colorOrangyRed"
                          style={{
                            backgroundImage: `url(${iconWhiteCheckmarkFilled})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                          }}
                          name='login-check'
                          id='login-check'
                        />
                        <label htmlFor='login-check' className='text-base leading-[1.6]'>
                          Запомнить меня
                        </label>
                      </div>
                      <Link to='/reset-password' className='text-base hover:text-colorOrangyRed'>
                        Забыли пароль?
                      </Link>
                    </div>
                  </div>
                  <button
                    type='submit'
                    className='button mt-7 block rounded-[50px] border-2 border-black bg-black py-4 text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white'
                    disabled={isLoading} // Делаем кнопку недоступной, пока идет загрузка
                  >
                    {isLoading ? 'Вход...' : 'Войти'}
                  </button>
                </form>
                <div className='mt-10 text-center'>
                  Нет аккаунта? &nbsp;
                  <Link to='/signup' className='text-base font-semibold hover:text-colorOrangyRed'>
                    Зарегистрироваться
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

export default Login;
