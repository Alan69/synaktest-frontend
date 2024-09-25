import { combineReducers } from '@reduxjs/toolkit';
import baseApi from './api';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  // auth: authReducer,
  // contentPlan: contentPlanReducer,
  // post: postReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
