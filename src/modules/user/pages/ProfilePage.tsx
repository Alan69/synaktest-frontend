import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Form, Input, Button, Select, message, Alert, Tag, Table } from "antd";
import InputMask from "react-input-mask";
import {
  UserOutlined,
  LockOutlined,
  DollarOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import {
  TUser,
  useChangePasswordMutation,
  useGetAuthUserQuery,
  useUpdateBalanceMutation,
  useUpdateUserProfileMutation,
  useGenerateReferralLinkMutation,
  useGetReferredUsersQuery,
} from "modules/user/redux/slices/api";
import { ModalAddBalance } from "../components/ModalAddBalance/ModalAddBalance";
import Title from "antd/es/typography/Title";
import { useGetRegionListQuery } from "../../../redux/api/regionsApi";

const { Option } = Select;

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState("personal-info");
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetAuthUserQuery();
  const { data: regions, isLoading: isRegionsLoading } =
    useGetRegionListQuery();
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [updateBalance] = useUpdateBalanceMutation();
  const [generateReferralLink, { isLoading: isGeneratingLink }] =
    useGenerateReferralLinkMutation();
  const { data: referredUsers, isLoading: isLoadingReferrals } = useGetReferredUsersQuery();

  useEffect(() => {
    if (
      location.pathname === "/profile" ||
      location.pathname === "/profile/personal-info"
    ) {
      setSelectedMenu("personal-info");
    } else if (location.pathname === "/profile/update-password") {
      setSelectedMenu("update-password");
    } else if (location.pathname === "/profile/balance") {
      setSelectedMenu("balance");
    } else if (location.pathname === "/profile/referral") {
      setSelectedMenu("referral");
    }
  }, [location.pathname]);

  useEffect(() => {
    console.log('Referred users:', referredUsers);
  }, [referredUsers]);

  const handleProfileUpdate = async (values: TUser) => {
    const phoneNumber = values.phone_number.replace(/\D/g, "");
    try {
      await updateUserProfile({
        ...values,
        phone_number: phoneNumber,
        region: values.region,
        referral_link: values.referral_link || undefined
      }).unwrap();
      message.success("Профиль успешно обновлен!");
    } catch (error: any) {
      message.error(error.data.detail);
    }
  };

  const handlePasswordChange = async (values: any) => {
    const { current_password, new_password, new_password2 } = values;

    if (new_password !== new_password2) {
      message.error("Пароли не совпадают!");
      return;
    }

    try {
      await changePassword({
        current_password,
        new_password,
        new_password2,
      }).unwrap();
      message.success("Пароль успешно изменен!");
    } catch (error: any) {
      message.error(error.data.detail);
    }
  };

  const handleUpdateBalance = () => {
    updateBalance()
      .unwrap()
      .then((res) => {
        message.success(res.success);

        refetchUser();
      })
      .catch((error) => {
        message.error(error.data.error);
      });
  };

  const handleGenerateReferralLink = async () => {
    try {
      const result = await generateReferralLink().unwrap();
      await refetchUser();
      message.success('Реферальная ссылка успешно создана!');
    } catch (error: any) {
      message.error('Ошибка при создании реферальной ссылки');
    }
  };

  const renderReferralContent = () => {
    const columns = [
      {
        title: 'ИИН',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'Имя',
        dataIndex: 'first_name',
        key: 'first_name',
      },
      {
        title: 'Фамилия',
        dataIndex: 'last_name',
        key: 'last_name',
      },
      {
        title: 'Сумма покупок',
        dataIndex: 'total_purchases',
        key: 'total_purchases',
        render: (amount: string) => `${amount} KZT`,
      },
    ];

    return (
      <div>
        <Title level={4}>Реферальная программа</Title>
        <div style={{ marginBottom: '20px' }}>
          <p>Заработано с рефералов: {user?.referral_bonus} KZT</p>
          <p>Ваш процент с покупок рефералов: {user?.referral_percentage}%</p>
          {user?.referral_expiry_date && (
            <p>
              Срок действия реферальной программы: {' '}
              <span style={{ 
                color: new Date(user.referral_expiry_date) > new Date() ? 'green' : 'red' 
              }}>
                {new Date(user.referral_expiry_date).toLocaleDateString()}
              </span>
            </p>
          )}
        </div>
        
        {user?.referral_link ? (
          <div style={{ marginTop: '20px' }}>
            <Alert
              message="Ваша реферальная ссылка"
              description={
                <div>
                  <Input.Group compact>
                    <Input
                      style={{ width: 'calc(100% - 200px)' }}
                      value={user.referral_link}
                      readOnly
                    />
                    <Button
                      type="primary"
                      onClick={() => {
                        navigator.clipboard.writeText(user.referral_link || '');
                        message.success('Ссылка скопирована!');
                      }}
                      icon={<CopyOutlined />}
                    >
                      Копировать ссылку
                    </Button>
                  </Input.Group>
                  <div style={{ marginTop: '10px' }}>
                    <Tag color={
                      !user.referral_expiry_date ? 'default' :
                      new Date(user.referral_expiry_date) > new Date() ? 'success' : 'error'
                    }>
                      {user.referral_status}
                    </Tag>
                  </div>
                </div>
              }
              type="info"
              showIcon
            />
          </div>
        ) : (
          <Button
            type="primary"
            onClick={handleGenerateReferralLink}
            icon={<ShareAltOutlined />}
            loading={isGeneratingLink}
          >
            Создать реферальную ссылку
          </Button>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <Alert
            message="Как это работает?"
            description={
              <ul>
                <li>Создайте свою реферальную ссылку</li>
                <li>Поделитесь ссылкой с друзьями</li>
                <li>Когда друг регистрируется по вашей ссылке и совершает покупку, вы получаете {user?.referral_percentage}% от суммы покупки</li>
                <li>Ссылка действует до {user?.referral_expiry_date ? new Date(user.referral_expiry_date).toLocaleDateString() : 'не ограничено'}</li>
              </ul>
            }
            type="info"
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <Title level={5}>Ваши рефералы</Title>
          <Table
            dataSource={referredUsers}
            columns={columns}
            loading={isLoadingReferrals}
            rowKey="username"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'Нет рефералов' }}
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!user) {
      return <p>Загрузка данных...</p>;
    }

    switch (selectedMenu) {
      case "personal-info":
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
            <Form.Item
              label="ИИН"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите ИИН!",
                },
                {
                  pattern: /^\d{12}$/,
                  message: "ИИН должен состоять из 12 цифр!",
                },
              ]}
            >
              <Input disabled={isUserLoading} maxLength={12} />
            </Form.Item>
            <Form.Item
              label="Имя"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите имя!",
                },
              ]}
            >
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Form.Item
              label="Фамилия"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите фамилию!",
                },
              ]}
            >
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Form.Item
              label="Почта"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Пожалуйста, введите корректный email!",
                },
              ]}
            >
              <Input disabled={isUserLoading} />
            </Form.Item>

            <Form.Item
              label="Телефон"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите номер телефона!",
                },
              ]}
            >
              <InputMask
                mask="+7 999 999 99 99"
                placeholder="+7 777 777 77 77"
                disabled={isUserLoading}
              >
                {/* @ts-ignore */}
                {(inputProps) => <Input {...inputProps} />}
              </InputMask>
            </Form.Item>

            <Form.Item
              label="Регион"
              name="region"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите регион!",
                },
              ]}
            >
              <Select
                placeholder="Выберите регион"
                loading={isRegionsLoading}
                disabled={isUserLoading}
              >
                {regions?.map((region) => (
                  <Option key={region.id} value={region.id}>
                    {region.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Учреждение"
              name="school"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите учреждение!",
                },
              ]}
            >
              <Input disabled={isUserLoading} />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              disabled={isUserLoading}
            >
              Сохранить изменения
            </Button>
          </Form>
        );
      case "update-password":
        return (
          <Form layout="vertical" onFinish={handlePasswordChange}>
            <Form.Item
              label="Старый пароль"
              name="current_password"
              rules={[{ required: true, message: "Введите текущий пароль" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Новый пароль"
              name="new_password"
              rules={[{ required: true, message: "Введите новый пароль" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Подтвердите новый пароль"
              name="new_password2"
              rules={[{ required: true, message: "Подтвердите новый пароль" }]}
            >
              <Input.Password />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isChangingPassword}
            >
              Изменить пароль
            </Button>
          </Form>
        );
      case "balance":
        return (
          <div>
            <Title level={4}>Текущий баланс: {user.balance} KZT</Title>
            <div style={{ display: "flex", gap: "16px" }}>
              <Button
                type="primary"
                onClick={() => setIsBalanceModalOpen(true)}
              >
                Пополнить баланс
              </Button>
              <Button
                type="primary"
                onClick={handleUpdateBalance}
                icon={<ReloadOutlined />}
              >
                Обновить баланс
              </Button>
            </div>
          </div>
        );
      case "referral":
        return renderReferralContent();
      default:
        return null;
    }
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "personal-info":
        navigate("/profile/personal-info");
        break;
      case "update-password":
        navigate("/profile/update-password");
        break;
      case "balance":
        navigate("/profile/balance");
        break;
      case "referral":
        navigate("/profile/referral");
        break;
      default:
        navigate("/profile");
        break;
    }
  };

  return (
    <>
      <div style={{ display: "flex", padding: "20px", minHeight: "750px" }}>
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
          <Menu.Item key="referral" icon={<ShareAltOutlined />}>
            Реферальная программа
          </Menu.Item>
        </Menu>
        <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
          {renderContent()}
        </div>
      </div>
      <ModalAddBalance
        isOpen={isBalanceModalOpen}
        setIsOpen={setIsBalanceModalOpen}
      />
    </>
  );
};

export default ProfilePage;
