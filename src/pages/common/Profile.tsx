import { useState, useEffect } from 'react';
import { useAddBalanceMutation, useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../redux/api/profileAPI';
import swal from 'sweetalert';

const Profile = () => {
  const { data: profile, isError: isProfileError, refetch } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [addBalance, { isLoading: isAddingBalance }] = useAddBalanceMutation();

  const [input, setInput] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    region: '',
    institution: '',
    phone: '',
    balance: '0',
    referral: '',
    bonus: '0',
  });

  useEffect(() => {
    if (profile) {
      setInput({
        username: profile.username || '',
        email: profile.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        region: profile.region || '',
        institution: profile.school || '',
        phone: profile.phone_number || '',
        balance: profile.balance || '0',
        referral: profile.referral_link || '',
        bonus: profile.referral_bonus || '0',
      });
    }
  }, [profile]);

  const handleInput = (e: any) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateData = async (e: any) => {
    e.preventDefault();
    try {
      await updateUserProfile(input).unwrap();
      swal('Успешно', 'Профиль успешно обновлен', 'success');
    } catch (error) {
      swal('Ошибка', 'Не удалось обновить данные профиля', 'error');
    }
  };

  const handleUpdateBalance = async () => {
    try {
      await addBalance().unwrap();
      swal('Успех', 'Баланс успешно обновлен', 'success');
      refetch();
    } catch (error) {
      swal('Ошибка', 'Ошибка при обновлении баланса', 'error');
    }
  };

  const handleChangePassword = (e: any) => {
    e.preventDefault();
    swal('Изменить пароль', 'Функция смены пароля еще не реализована', 'info');
  };

  const handleAddFunds = (e: any) => {
    e.preventDefault();
    swal('Пополнить баланс', 'Функция пополнения баланса еще не реализована', 'info');
  };

  return (
    <div className="container mx-auto p-6">
      <div className='order-1 block rounded-lg bg-white px-[80px] py-[80px] md:order-2'>
        <h2 className='font-bold leading-[1.6]'>Профиль</h2>
        <form onSubmit={handleUpdateData} className='flex flex-col gap-y-5'>
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-username' className='text-lg font-bold leading-[1.6]'>Имя пользователя</label>
              <input
                type='text'
                name='username'
                value={input.username}
                onChange={handleInput}
                id='profile-username'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                disabled
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-first_name' className='text-lg font-bold leading-[1.6]'>Имя</label>
              <input
                type='text'
                name='first_name'
                value={input.first_name}
                onChange={handleInput}
                id='profile-first_name'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-last_name' className='text-lg font-bold leading-[1.6]'>Фамилия</label>
              <input
                type='text'
                name='last_name'
                value={input.last_name}
                onChange={handleInput}
                id='profile-last_name'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-region' className='text-lg font-bold leading-[1.6]'>Регион</label>
              <input
                type='text'
                name='region'
                value={input.region}
                onChange={handleInput}
                id='profile-region'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-institution' className='text-lg font-bold leading-[1.6]'>Учреждение</label>
              <input
                type='text'
                name='institution'
                value={input.institution}
                onChange={handleInput}
                id='profile-institution'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-email' className='text-lg font-bold leading-[1.6]'>Электронная почта</label>
              <input
                type='email'
                name='email'
                value={input.email}
                onChange={handleInput}
                id='profile-email'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-phone' className='text-lg font-bold leading-[1.6]'>Телефон</label>
              <input
                type='tel'
                name='phone'
                value={input.phone}
                onChange={handleInput}
                id='profile-phone'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-balance' className='text-lg font-bold leading-[1.6]'>Баланс</label>
              <input
                type='text'
                name='balance'
                value={input.balance}
                onChange={handleInput}
                id='profile-balance'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                disabled
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-referral' className='text-lg font-bold leading-[1.6]'>Реферальная ссылка</label>
              <input
                type='text'
                name='referral'
                value={input.referral}
                onChange={handleInput}
                id='profile-referral'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                disabled
              />
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <label htmlFor='profile-bonus' className='text-lg font-bold leading-[1.6]'>Бонус</label>
              <input
                type='text'
                name='bonus'
                value={input.bonus}
                onChange={handleInput}
                id='profile-bonus'
                className='rounded-[10px] border border-gray-300 bg-white px-6 py-[18px] font-bold text-black outline-none transition-all placeholder:text-slate-500 focus:border-colorOrangyRed'
                disabled
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
            <div>
              <button
                type='submit'
                className='w-full rounded-full bg-colorOrangyRed px-[60px] py-[17px] text-lg font-bold text-white transition-all hover:bg-black'
              >
                Обновить данные
              </button>
            </div>
            <div>
              <button
                type='button'
                onClick={handleChangePassword}
                className='w-full rounded-full bg-black px-[60px] py-[17px] text-lg font-bold text-white transition-all hover:bg-colorOrangyRed'
              >
                Изменить пароль
              </button>
            </div>
            <div>
              <button
                type='button'
                onClick={handleUpdateBalance}
                className='w-full rounded-full bg-black px-[60px] py-[17px] text-lg font-bold text-white transition-all hover:bg-colorOrangyRed'
              >
                Обновить баланс
              </button>
            </div>
            <div>
              <button
                type='button'
                onClick={handleAddFunds}
                className='w-full rounded-full bg-black px-[60px] py-[17px] text-lg font-bold text-white transition-all hover:bg-colorOrangyRed'
              >
                Пополнить баланс
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
