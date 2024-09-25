import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import baseApi from './api';

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
