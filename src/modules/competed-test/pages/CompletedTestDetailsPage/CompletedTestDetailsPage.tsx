import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import { differenceInMilliseconds } from 'date-fns';
import cn from 'classnames';
import { useLazyGetAuthUserQuery } from 'modules/user/redux/slices/api';
import { useGetCompletedTestByIdQuery } from 'modules/competed-test/redux/api';
import styles from './CompletedTestDetailsPage.module.scss';
import { Progress } from 'antd';

export const CompletedTestDetailsPage = () => {
  const { id } = useParams();
  const [getAuthUser] = useLazyGetAuthUserQuery();
  const { data } = useGetCompletedTestByIdQuery(id);

  const formatTimeDifference = (startTime: string, endTime: string) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const difference = differenceInMilliseconds(endDate, startDate);

    const totalSeconds = Math.floor(difference / 1000);
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} часа ${minutes} минут ${seconds} секунд`;
  };

  const startTime = "2024-07-14T17:12:10.641383Z";
  const finishTime = "2024-07-15T18:00:01.855334Z";

  const durationFormatted = formatTimeDifference(startTime, finishTime);

  const getGrade = (percentage: number) => {
    if (percentage >= 90) {
      return 5;
    } else if (percentage >= 70) {
      return 4;
    } else if (percentage >= 50) {
      return 3;
    } else {
      return 2;
    }
  };

  const correctAnswers = data?.product?.total_correct_by_all_tests || 0;
  const inCorrectAnswers = data?.product?.total_incorrect_by_all_tests || 0;
  const totalQuestions = ((data?.product?.total_correct_by_all_tests || 0) + (data?.product?.total_incorrect_by_all_tests || 0)) || 0;
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  useEffect(() => {
    getAuthUser();
  }, [getAuthUser]);

  return (
    <div className={styles.page}>
      <Title level={1}>Результаты теста - {data?.product.title}</Title>

      <div className={styles.body}>
        <div className={styles.scoreCards}>
          <div className={styles.scoreCards__item}>
            <span>Общие количество вопросов</span>
            <span>{totalQuestions}</span>
          </div>
          <div className={styles.scoreCards__item}>
            <span>Процент прохождения</span>
            <span>{percentage.toFixed(2)}%</span>
          </div>
          <div className={styles.scoreCards__item}>
            <span>Правильных</span>
            <span>{correctAnswers}</span>
          </div>
          <div className={styles.scoreCards__item}>
            <span>Неправильных</span>
            <span>{inCorrectAnswers}</span>
          </div>
        </div>

        <div className={styles.mainInfoCards}>
          <div className={styles.mainInfoCards__item}>
            <Title level={4}>Общая информация</Title>
            <div className={styles.mainInfoCards__item__row}>
              <div className={styles.mainInfoCards__item__label}>
                Имя-фамилия
              </div>
              <div className={styles.mainInfoCards__item__value}>
                {data?.user}
              </div>
            </div>
            <div className={styles.mainInfoCards__item__row}>
              <div className={styles.mainInfoCards__item__label}>
                Дата начала
              </div>
              <div className={styles.mainInfoCards__item__value}>
                {startTime}
              </div>
            </div>
            <div className={styles.mainInfoCards__item__row}>
              <div className={styles.mainInfoCards__item__label}>
                Дата завершения
              </div>
              <div className={styles.mainInfoCards__item__value}>
                {finishTime}
              </div>
            </div>
            <div className={styles.mainInfoCards__item__row}>
              <div className={styles.mainInfoCards__item__label}>
                Продолжительность(мин)
              </div>
              <div className={styles.mainInfoCards__item__value}>
                {durationFormatted}
              </div>
            </div>
          </div>

          <div className={styles.mainInfoCards__item}>
            <Title level={4}>Показатели успеха по предметам</Title>
            {
              data?.product.tests.map((el) => (
                <div className={styles.mainInfoCards__item__row}>
                  <div className={cn(styles.mainInfoCards__item__label, styles.mainInfoCards__item__label__wFixed)}>
                    {el.title}
                  </div>
                  <Progress percent={Number(((el.total_correct_by_test / el.questions.length) * 100).toFixed(2))} />
                  <div className={cn(styles.mainInfoCards__item__value, styles.mainInfoCards__item__value__wFixed)}>
                    {`${el.total_correct_by_test} из ${el.questions.length}`}
                  </div>
                </div>
              ))
            }
          </div>

          <div className={styles.mainInfoCards__item}>
            <Title level={4}>Оценка по предметам</Title>
            {
              data?.product.tests.map((el) => (
                <div className={styles.mainInfoCards__item__row}>
                  <div className={styles.mainInfoCards__item__label}>
                    {el.title}
                  </div>
                  <div className={styles.mainInfoCards__item__value}>
                    {getGrade(((el.total_correct_by_test / el.questions.length) * 100))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className={styles.errorWorkCard}>
          <Title level={4}>Работа над ошибками</Title>
          <div className={styles.errorWorkCard__row}>
            {
              data?.product.tests.map((el) => (
                <div className={styles.errorWorkCard__column}>
                  <div className={styles.errorWorkCard__label}>
                    {el.title}
                  </div>
                  <div className={styles.errorWorkCard__question}>
                    {el.questions.map((el) => (
                      <div className={styles.errorWorkCard__question__item}>
                        1
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};
