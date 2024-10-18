import React, { useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './ModalFinishTestNew.module.scss'

type TProps = {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  unansweredQuestions: {
    testTitle: string;
    questionNumber: number;
    questionId: string;
  }[]
  handleCompleteTest: () => Promise<void>
  isCompleting: boolean
}

export const ModalFinishTestNew = ({
  isOpen,
  setOpen,
  unansweredQuestions,
  handleCompleteTest,
  isCompleting
}: TProps) => {
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      title={<Typography.Title level={3}> <ExclamationCircleFilled className={styles.icon} /> Вы действительно хотите завершить тест?</Typography.Title>}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel} disabled={isCompleting}>
          Закрыть
        </Button>,
        <Button key="submit" type="primary" loading={isCompleting} onClick={() => {
          handleCompleteTest()
        }}>
          Завершить
        </Button>,
      ]}
      width={600}
    >
    </Modal>
  )
}
