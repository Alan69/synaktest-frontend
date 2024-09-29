import { bindActionCreators } from '@reduxjs/toolkit'
import { authActions } from 'modules/auth/redux/slices/authSlice'
import { useDispatch } from 'react-redux'

const allActions = {
  ...authActions,
}

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(allActions, dispatch)
}
