import baseApi from ".";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (newUser) => ({
        url: '/register/',
        method: 'POST',
        body: newUser,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: (refreshToken) => ({
        url: '/logout/',
        method: 'POST',
        body: { refresh: refreshToken },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } = authApi;
