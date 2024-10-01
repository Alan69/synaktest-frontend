import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { TUser } from '../../../user/redux/slices/api';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: TUser | null;
}

const initialState: AuthState = {
  token: Cookies.get('token') || null,
  refreshToken: Cookies.get('refreshToken') || null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (
      state,
      { payload: { refreshToken, token } }: PayloadAction<{ token: string | null; refreshToken: string | null }>
    ) => {
      state.token = token;
      state.refreshToken = refreshToken;

      if (token) {
        Cookies.set('token', token, { expires: 7 });
      }
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 7 });
      }
    },
    setUser: (state, { payload }: PayloadAction<TUser | null>) => {
      state.user = payload;
    },
    logOut: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;

      Cookies.remove('token');
      Cookies.remove('refreshToken');
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export type { AuthState };
