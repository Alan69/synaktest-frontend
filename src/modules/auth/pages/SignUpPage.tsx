import { Link, useLocation } from "react-router-dom";
import { useSignUpMutation } from "modules/auth/redux/api";
import { Form, Input, Button, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { authActions } from "modules/auth/redux/slices/authSlice";
import Title from "antd/es/typography/Title";
import { useGetRegionListQuery } from "../../../redux/api/regionsApi";
import InputMask from "react-input-mask";

const { Option } = Select;

const SignUpPage = () => {
  const dispatch = useDispatch();
  const [signUp, { isLoading }] = useSignUpMutation();
  const location = useLocation();

  // Extract referral code from URL
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get('ref');

  const { data: regions, isLoading: isRegionsLoading } =
    useGetRegionListQuery();

  const onFinish = async (values: any) => {
    const phoneNumber = values.phone_number.replace(/\+|\s/g, "");

    if (values.password !== values.password2) {
      message.error("Пароли не совпадают!");
      return;
    }

    try {
      console.log("Sending signup request with data:", { 
        ...values, 
        phone_number: phoneNumber,
        referral_code: referralCode // Add referral code from URL
      });
      
      const response = await signUp({
        ...values,
        phone_number: phoneNumber,
        region: values.region,
        referral_code: referralCode // Add referral code from URL
      });
      
      console.log("Signup response:", response);
      // @ts-ignore
      const { access: token, refresh: refreshToken } = response.data;

      dispatch(authActions.setToken({ token, refreshToken }));
      message.success("Регистрация успешна! Пожалуйста, войдите в систему.");
    } catch (error) {
      console.error("Signup error:", error);
      message.error(
        "Ошибка регистрации. Пожалуйста, проверьте введенные данные."
      );
    }
  };

  return (
    <main className="main-wrapper relative overflow-hidden">
      <section id="signup-section">
        <div className="py-40 pt-36 xl:pb-[80px] xl:pt-[60px]">
          <div className="global-container">
            <div className="mx-auto max-w-[910px] text-center">
              <Title level={1} className="mb-[60px]">
                Создать аккаунт
              </Title>
              <div className="block rounded-lg bg-white px-[30px] py-[50px] text-left shadow-[0_4px_60px_0_rgba(0,0,0,0.1)] sm:px-10">
                <Form
                  onFinish={onFinish}
                  className="flex flex-col"
                  layout="vertical"
                  requiredMark={false}
                >
                  <Form.Item
                    name="username"
                    label="ИИН"
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
                    <Input
                      placeholder="Введите ИИН"
                      className="rounded-[10px]"
                      maxLength={12}
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Почта"
                    rules={[
                      { required: true, message: "Пожалуйста, введите почту!" },
                      { type: "email", message: "Введите корректный email!" },
                    ]}
                  >
                    <Input
                      placeholder="example@gmail.com"
                      className="rounded-[10px]"
                    />
                  </Form.Item>

                  <Form.Item
                    name="first_name"
                    label="Имя"
                    rules={[
                      { required: true, message: "Пожалуйста, введите имя!" },
                    ]}
                  >
                    <Input
                      placeholder="Введите имя"
                      className="rounded-[10px]"
                    />
                  </Form.Item>

                  <Form.Item
                    name="last_name"
                    label="Фамилия"
                    rules={[
                      {
                        required: true,
                        message: "Пожалуйста, введите фамилию!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Введите фамилию"
                      className="rounded-[10px]"
                    />
                  </Form.Item>

                  <Form.Item
                    name="region"
                    label="Регион"
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
                      className="rounded-[10px]"
                      style={{ width: "100%" }}
                    >
                      {regions?.map((region) => (
                        <Option key={region.id} value={region.id}>
                          {region.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="school"
                    label="Школа"
                    rules={[
                      {
                        required: true,
                        message: "Пожалуйста, укажите школу!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Введите школу"
                      className="rounded-[10px]"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone_number"
                    label="Номер телефона"
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
                      className="rounded-[10px]"
                    >
                      {/* @ts-ignore */}
                      {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[
                      {
                        required: true,
                        message: "Пожалуйста, введите пароль!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="............"
                      className="rounded-[10px]"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password2"
                    label="Подтвердите пароль"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Пожалуйста, подтвердите пароль!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Пароли не совпадают!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="............"
                      className="rounded-[10px]"
                    />
                  </Form.Item>

                  {/* <Form.Item
                    name="referral_code"
                    label="Реферальная ссылка"
                  >
                    <Input
                      placeholder="Вставьте реферальную ссылку (если есть)"
                      className="rounded-[10px]"
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      Если у вас есть реферальная ссылка, вставьте ее полностью (например: http://127.0.0.1:8000/signup?ref=abc123)
                    </div>
                  </Form.Item> */}

                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ height: "auto" }}
                    className="button mt-7 block rounded-[50px] border-2 bg-black py-4 text-white after:bg-colorMainPurple hover:border-colorMainPurple hover:text-white"
                    loading={isLoading}
                  >
                    {isLoading ? "Регистрация..." : "Создать аккаунт"}
                  </Button>
                </Form>
                <div className="mt-10 text-center">
                  Уже есть аккаунт? &nbsp;
                  <Link
                    to="/login"
                    className="text-base font-semibold hover:text-colorMainPurple"
                  >
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

export default SignUpPage;
