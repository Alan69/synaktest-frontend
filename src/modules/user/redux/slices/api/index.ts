import baseApi from '../../../../../redux/api/index';
import { authActions } from '../../../../auth/redux/slices/authSlice';

export type TUser = {
  username: string
  email: string
  first_name: string
  last_name: string
  region: string
  school: string
  phone_number: string
  balance: string
  referral_link: any
  referral_bonus: string
  test_is_started: boolean
}

export type TUserData = {
  user_data: TUserData
}

export const userApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
    getAuthUser: build.query<TUserData, void>({
      query: () => ({
        url: '/user/auth/',
          method: 'GET'
        }),
      transformResponse: (response: TUserData) => response.user_data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // @ts-ignore
          dispatch(authActions.setUser(data));
        } catch (err) {
          console.error('Failed to fetch user data', err);
        }
      },
    }),

	}),
	overrideExisting: false,
});

export const {
  useLazyGetAuthUserQuery,
  useGetAuthUserQuery,
} = userApi;
