import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useConfirmPasswordResetMutation } from '../redux/slices/api';

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccessful, setResetSuccessful] = useState(false);
  
  // Extract token and uid from URL query parameters
  const [token, setToken] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  const [confirmPasswordReset] = useConfirmPasswordResetMutation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    const uidParam = queryParams.get('uid');

    if (tokenParam && uidParam) {
      setToken(tokenParam);
      setUid(uidParam);
    } else {
      message.error('Недействительная ссылка для сброса пароля');
    }
  }, [location]);

  const onFinish = async (values: { new_password: string; new_password2: string }) => {
    if (!token || !uid) {
      message.error('Отсутствуют необходимые параметры для сброса пароля');
      return;
    }

    try {
      setIsLoading(true);
      await confirmPasswordReset({
        token,
        uid,
        new_password: values.new_password,
        new_password2: values.new_password2
      }).unwrap();
      
      setResetSuccessful(true);
      message.success('Ваш пароль был успешно сброшен');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      message.error('Не удалось сбросить пароль. Возможно, ссылка недействительна или срок ее действия истек.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !uid) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', padding: '20px', textAlign: 'center' }}>
        <Title level={3}>Недействительная ссылка</Title>
        <Text style={{ display: 'block', marginBottom: 24 }}>
          Ссылка для сброса пароля недействительна или срок ее действия истек.
        </Text>
        <Link to="/forgot-password">Запросить новую ссылку</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>Сброс пароля</Title>
      </div>
      
      {!resetSuccessful ? (
        <>
          <Text style={{ display: 'block', marginBottom: 24 }}>
            Пожалуйста, введите новый пароль для вашей учетной записи.
          </Text>
          
          <Form
            form={form}
            layout="vertical"
            name="reset_password_form"
            onFinish={onFinish}
          >
            <Form.Item
              name="new_password"
              rules={[
                { required: true, message: 'Пожалуйста, введите новый пароль!' },
                { min: 8, message: 'Пароль должен содержать минимум 8 символов!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Новый пароль" 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              name="new_password2"
              dependencies={['new_password']}
              rules={[
                { required: true, message: 'Пожалуйста, подтвердите пароль!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new_password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Подтвердить новый пароль" 
                size="large" 
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={isLoading}
              >
                Сбросить пароль
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Text style={{ display: 'block', marginBottom: 24 }}>
            Ваш пароль был успешно сброшен. Вы будете перенаправлены на страницу входа через несколько секунд.
          </Text>
          <Link to="/login">Перейти на страницу входа</Link>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage; 