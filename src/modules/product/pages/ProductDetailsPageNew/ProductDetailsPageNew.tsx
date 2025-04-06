import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import cn from "classnames";
import { message, Spin } from "antd";
import {
  useGetProductByIdQuery,
  useGetSubjectListByProductIdQuery,
  useStartTestMutation,
  productApi
} from "modules/product/redux/api";
import { TAG_TYPES } from "../../../../redux/api";
import { CustomCheckbox } from "../../../../components/CustomCheckbox/CustomCheckbox";
import styles from "./ProductDetailsPageNew.module.scss";
import StartedTestFormNew from "modules/product/components/StartedTestFormNew/StartedTestFormNew";
import { useLazyGetAuthUserQuery } from "modules/user/redux/slices/api";
import { useTypedSelector } from "hooks/useTypedSelector";
import { ModalNotEnoughBalance } from "modules/product/components/ModalNotEnoughBalance/ModalNotEnoughBalance";
import { useDispatch } from "react-redux";
import { TimerContext } from "../../../../App";

const ProductDetailsPageNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Access TimerContext for timer reset functionality
  const timerContext = useContext(TimerContext);

  const { user } = useTypedSelector((state) => state.auth);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get the latest user data first to ensure test_is_started is up to date
  const [getAuthUser, { isSuccess: isUserLoaded }] = useLazyGetAuthUserQuery();
  const [startTest] = useStartTestMutation();

  useEffect(() => {
    // Always get the latest user data when component mounts
    getAuthUser();

    // Check if we just completed a test and landed back here
    const fromTestCompletion = sessionStorage.getItem("test_just_completed");
    if (fromTestCompletion === "true") {
      // Clear the flag
      sessionStorage.removeItem("test_just_completed");
      
      // Force refresh everything
      dispatch(productApi.util.invalidateTags([
        'SubjectList' as const,
        'Product' as const,
        'User' as const
      ]));
      
      // Trigger a component refresh
      setRefreshTrigger(prev => prev + 1);
      
      // Show message to user
      message.success("Тест завершен. Теперь вы можете выбрать новый тест.");
    }
  }, [dispatch, getAuthUser]);

  // Now query for product and subject data after user data is loaded
  const { data: product, isLoading: isProductLoading } =
    useGetProductByIdQuery(id);
  const { data: subjectList, isLoading: isSubjectListLoading, refetch: refetchSubjectList } =
    useGetSubjectListByProductIdQuery(product?.id, {
      // Skip this query if product ID isn't available yet or if the user has a test in progress
      skip: !product?.id || (user?.test_is_started === true),
    });

  // Force refetch of subject list when component mounts or when refreshTrigger changes
  useEffect(() => {
    if (product?.id && user?.test_is_started === false) {
      // Invalidate all relevant caches
      dispatch(
        productApi.util.invalidateTags([
          'SubjectList' as const,
          'Product' as const,
          'User' as const
        ])
      );
      
      // Explicitly refetch the subject list
      refetchSubjectList();
    }
  }, [dispatch, product?.id, refetchSubjectList, user?.test_is_started, refreshTrigger]);

  const [title, setTitle] = useState("Купить продукт");
  const [selectedRequiredSubjects, setSelectedRequiredSubjects] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: string]: boolean;
  }>({});
  const [testIsStarted, setTestIsStarted] = useState<boolean>(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState<
    { testTitle: string; questionNumber: number; questionId: string }[]
  >([]);
  const [isFinishTestModalOpen, setIsFinishTestModalOpen] = useState(false);
  const [isNotEnoughBalanceModalOpen, setIsNotEnoughBalanceModalOpen] =
    useState(false);

  const selectedCount = Object.values(selectedSubjects).filter(Boolean).length;

  const MAX_SELECTION = product?.subject_limit;

  const handleStart = async () => {
    if (!product || !user) {
      message.error("Продукт или данные пользователя не загружены");
      return;
    }

    if (parseFloat(user.balance) < product.sum) {
      setIsNotEnoughBalanceModalOpen(true);
      return;
    }

    const requiredTestIds = Object.keys(selectedRequiredSubjects).filter(
      (key) => selectedRequiredSubjects[key]
    );
    const selectedTestIds = Object.keys(selectedSubjects).filter(
      (key) => selectedSubjects[key]
    );

    const tests_ids = [...requiredTestIds, ...selectedTestIds];

    if (selectedCount !== MAX_SELECTION) {
      message.error(`Вы не можете выбрать меньше ${MAX_SELECTION} предметов.`);
      return;
    }

    try {
      // Clear any existing timer data before starting new test
      localStorage.removeItem("remainingTime");
      
      const response = await startTest({
        product_id: id || "",
        tests_ids,
      }).unwrap();

      if (response) {
        const authResponse = await getAuthUser().unwrap();

        if (authResponse) {
          message.success("Тест успешно запущен");
          product && setTitle(product?.title);

          // Store test data in localStorage
          const serializedTests = JSON.stringify(response.tests);
          localStorage.setItem("test", serializedTests);
          localStorage.setItem("product_id", id || "");
          localStorage.setItem(
            "testIsStarted",
            JSON.stringify(authResponse.test_is_started)
          );

          if (response.time) {
            // Clear any previous test time and set the new one
            localStorage.setItem("testTime", JSON.stringify(response.time));
            
            // Force the timer to reset by using the TimerContext
            if (timerContext?.resetTimer) {
              setTimeout(() => {
                timerContext.resetTimer();
                console.log("Timer reset called from handleStart");
              }, 100);
            }
            
            message.success("Время теста успешно сохранено и таймер запущен.");
          }

          setTestIsStarted(authResponse.test_is_started);

          // Use a short delay before reloading to allow the timer reset to be processed
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          message.error("Не удалось получить данные пользователя.");
        }
      } else {
        message.error("Не удалось получить ответ при запуске теста.");
      }
    } catch (error) {
      message.error("Ошибка при запуске теста.");
      console.error("Ошибка запуска теста:", error);
    }
  };

  const handleOpenFinistTestModal = () => {
    setIsFinishTestModalOpen(true);
  };

  const handleNext = () => {
    setTitle("Выбор теста");
  };

  const handleBack = () => {
    if (title === "Купить продукт") {
      navigate(-1);
    }
    if (title === "Выбор теста") {
      setTitle("Купить продукт");
    }
  };

  const handleCheckboxChange =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        selectedCount >= (MAX_SELECTION ? MAX_SELECTION : 1) &&
        !selectedSubjects[id]
      ) {
        message.warning(
          `Вы не можете выбрать более ${MAX_SELECTION} дополнительных предметов.`
        );
      } else {
        setSelectedSubjects({
          ...selectedSubjects,
          [id]: e.target.checked,
        });
      }
    };

  useEffect(() => {
    if (subjectList) {
      const requiredSubjects = subjectList.reduce((acc, group) => {
        group.tests.forEach((subject) => {
          if (subject.is_required) {
            acc[subject.id] = true;
          }
        });
        return acc;
      }, {} as { [key: string]: boolean });

      setSelectedRequiredSubjects(requiredSubjects);
    }
  }, [subjectList]);

  useEffect(() => {
    const testStarted = localStorage.getItem("testIsStarted");
    if (testStarted) {
      setTestIsStarted(JSON.parse(testStarted));
    }
  }, []);

  if (isProductLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.container}>
          {testIsStarted ? (
            <StartedTestFormNew
              productTitle={product?.title}
              handleOpenFinistTestModal={handleOpenFinistTestModal}
              unansweredQuestions={unansweredQuestions}
              setUnansweredQuestions={setUnansweredQuestions}
              isFinishTestModalOpen={isFinishTestModalOpen}
              setIsFinishTestModalOpen={setIsFinishTestModalOpen}
            />
          ) : (
            <div className={styles.testBlock}>
              <div className={styles.testBlock__head}>
                <div className={styles.testBlock__title}>
                  {title === "Купить продукт"
                    ? product?.title
                    : "Выберите предмет"}
                </div>
                {title === "Купить продукт" && (
                  <div className={styles.testBlock__time}>
                    <div className={styles.testBlock__time__label}>Время:</div>
                    <div className={styles.testBlock__time__value}>
                      {product?.time} мин.
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.testBlock__body}>
                {title === "Купить продукт" && (
                  <div className={styles.testBlock__subtitle}>
                    Обязательные предметы:
                  </div>
                )}
                {subjectList?.map((group) => {
                  const displayGrade =
                    title !== "Купить продукт" &&
                    group.grade !== "0" &&
                    group.tests.some((test) => !test.is_required);

                  return (
                    <div key={group.grade}>
                      {displayGrade && (
                        <div
                          className={styles.testBlock__grade}
                          style={{
                            paddingBottom: 12,
                          }}
                        >
                          {`Класс: ${group.grade}`}
                        </div>
                      )}
                      <div className={styles.testBlock__checkboxes}>
                        {group.tests
                          .filter((test) =>
                            title === "Купить продукт"
                              ? test.is_required
                              : !test.is_required
                          )
                          .map((el) => (
                            <div
                              className={styles.testBlock__checkboxes__item}
                              key={el.id}
                            >
                              <CustomCheckbox
                                checked={
                                  title === "Купить продукт"
                                    ? el.is_required
                                    : selectedSubjects[el.id]
                                }
                                title={el.title}
                                onChange={handleCheckboxChange(el.id)}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  className={cn(
                    styles.testBlock__button,
                    styles.testBlock__button__back
                  )}
                  onClick={handleBack}
                >
                  {"< Назад"}
                </button>
                {title === "Купить продукт" ? (
                  <button
                    className={cn(
                      styles.testBlock__button,
                      styles.testBlock__button__next
                    )}
                    onClick={handleNext}
                    disabled={isProductLoading || isSubjectListLoading}
                  >
                    {"Далее >"}
                  </button>
                ) : (
                  <button
                    className={cn(
                      styles.testBlock__button,
                      styles.testBlock__button__start,
                      selectedCount !== MAX_SELECTION
                        ? styles.testBlock__button__disabled
                        : ""
                    )}
                    onClick={handleStart}
                    disabled={isProductLoading || isSubjectListLoading}
                  >
                    Начать
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalNotEnoughBalance
        isOpen={isNotEnoughBalanceModalOpen}
        setOpen={setIsNotEnoughBalanceModalOpen}
        balance={user?.balance || 0}
      />
    </>
  );
};

export default ProductDetailsPageNew;
