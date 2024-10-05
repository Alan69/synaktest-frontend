import React, { useState, useEffect } from 'react';
import { Menu, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, DollarOutlined } from '@ant-design/icons';
import { TUser, useChangePasswordMutation, useGetAuthUserQuery, useUpdateUserProfileMutation } from 'modules/user/redux/slices/api';
import { ModalAddBalance } from '../components/ModalAddBalance/ModalAddBalance';
import Title from 'antd/es/typography/Title';
import { useLocation, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState('personal-info');

  const { data: user, isLoading: isUserLoading } = useGetAuthUserQuery();
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  useEffect(() => {
    // Определяем активный таб на основе текущего URL
    if (location.pathname === '/profile' || location.pathname === '/profile/personal-info') {
      setSelectedMenu('personal-info');
    } else if (location.pathname === '/profile/update-password') {
      setSelectedMenu('update-password');
    } else if (location.pathname === '/profile/balance') {
      setSelectedMenu('balance');
    }
  }, [location.pathname]);

  const handleProfileUpdate = async (values: TUser) => {
    try {
      await updateUserProfile(values).unwrap();
      message.success('Профиль успешно обновлен!');
    } catch (error: any) {
      message.error(error.data.detail);
    }
  };

  const handlePasswordChange = async (values: any) => {
    const { current_password, new_password, new_password2 } = values;

    if (new_password !== new_password2) {
      message.error('Пароли не совпадают!');
      return;
    }

    try {
      await changePassword({ current_password, new_password, new_password2 }).unwrap();
      message.success('Пароль успешно изменен!');
    } catch (error: any) {
      message.error(error.data.detail);
    }
  };

  const renderContent = () => {
    if (!user) {
      return <p>Загрузка данных...</p>;
    }

    switch (selectedMenu) {
      case 'personal-info':
        return (
          <Form
            layout="vertical"
            onFinish={handleProfileUpdate}
            initialValues={{
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
              phone_number: user.phone_number,
              email: user.email,
              region: user.region,
              school: user.school,
            }}
          >
            <Form.Item label="Имя пользователя" name="username">
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Form.Item label="Имя" name="first_name">
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Form.Item label="Фамилия" name="last_name">
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Form.Item label="Почта" name="email">
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Form.Item label="Телефон" name="phone_number">
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Form.Item label="Регион" name="region">
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Form.Item label="Учреждение" name="school">
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating} disabled={isUserLoading}>
              Сохранить изменения
            </Button>
          </Form>
        );
      case 'update-password':
        return (
          <Form layout="vertical" onFinish={handlePasswordChange}>
            <Form.Item
              label="Старый пароль"
              name="current_password"
              rules={[{ required: true, message: 'Введите текущий пароль' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Новый пароль"
              name="new_password"
              rules={[{ required: true, message: 'Введите новый пароль' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Подтвердите новый пароль"
              name="new_password2"
              rules={[{ required: true, message: 'Подтвердите новый пароль' }]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isChangingPassword}>
              Изменить пароль
            </Button>
          </Form>
        );
      case 'balance':
        return (
          <div>
            <Title level={4}>Текущий баланс: {user.balance} KZT</Title>
            <Button type="primary" onClick={() => setIsBalanceModalOpen(true)}>
              Пополнить баланс
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'personal-info':
        navigate('/profile/personal-info');
        break;
      case 'update-password':
        navigate('/profile/update-password');
        break;
      case 'balance':
        navigate('/profile/balance');
        break;
      default:
        navigate('/profile');
        break;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', padding: '20px', minHeight: '750px' }}>
        <Menu
          mode="inline"
          style={{ width: 256 }}
          selectedKeys={[selectedMenu]}
          onClick={(e) => handleMenuClick(e.key)}
        >
          <Menu.Item key="personal-info" icon={<UserOutlined />}>
            Персональная информация
          </Menu.Item>
          <Menu.Item key="update-password" icon={<LockOutlined />}>
            Обновить пароль
          </Menu.Item>
          <Menu.Item key="balance" icon={<DollarOutlined />}>
            Баланс
          </Menu.Item>
        </Menu>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff' }}>
          {renderContent()}
        </div>
      </div>
      <ModalAddBalance isOpen={isBalanceModalOpen} setIsOpen={setIsBalanceModalOpen} />
    </>
  );
};

export default ProfilePage;
