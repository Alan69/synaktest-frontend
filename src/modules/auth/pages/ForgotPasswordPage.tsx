import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useRequestPasswordResetMutation } from '../redux/api';

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const [requestPasswordReset] = useRequestPasswordResetMutation();

  const onFinish = async (values: { email: string }) => {
    try {
      setIsLoading(true);
      await requestPasswordReset({ email: values.email }).unwrap();
      setEmailSent(true);
      message.success('Инструкции по восстановлению пароля отправлены на вашу почту');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      message.error('Не удалось отправить инструкции по восстановлению пароля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>Восстановление пароля</Title>
      </div>
      
      {!emailSent ? (
        <>
          <Text style={{ display: 'block', marginBottom: 24 }}>
            Введите адрес электронной почты, связанный с вашей учетной записью, и мы отправим вам ссылку для восстановления пароля.
          </Text>
          
          <Form
            form={form}
            layout="vertical"
            name="forgot_password_form"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Пожалуйста, введите ваш email!' },
                { type: 'email', message: 'Пожалуйста, введите корректный email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
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
                Отправить инструкции
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Text style={{ display: 'block', marginBottom: 24 }}>
            Инструкции по восстановлению пароля отправлены на указанный адрес электронной почты. 
            Пожалуйста, проверьте свою почту и следуйте инструкциям в письме.
          </Text>
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/login">Вернуться на страницу входа</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 