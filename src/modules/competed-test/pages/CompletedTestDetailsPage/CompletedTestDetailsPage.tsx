import { useGetCompletedTestByIdQuery } from 'modules/competed-test/redux/api';
import { useLazyGetAuthUserQuery } from 'modules/user/redux/slices/api';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

export const CompletedTestDetailsPage = () => {
  const { id } = useParams();
  const [getAuthUser] = useLazyGetAuthUserQuery();
  const { data } = useGetCompletedTestByIdQuery(id);

  useEffect(() => {
    getAuthUser()
  }, [])

  return (
    <div>{data?.id}</div>
  )
}
