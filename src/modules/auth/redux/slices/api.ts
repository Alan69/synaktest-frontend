import baseApi from 'redux/api';

// Password reset types
export type TPasswordResetRequest = {
  email: string;
};

export type TPasswordResetConfirm = {
  uid: string;
  token: string;
  new_password: string;
  new_password2: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Password reset request (sends email)
    requestPasswordReset: build.mutation<{ detail: string }, TPasswordResetRequest>({
      query: (credentials: TPasswordResetRequest) => ({
        url: '/password/reset/',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Password reset confirmation (validates token and sets new password)
    confirmPasswordReset: build.mutation<{ detail: string }, TPasswordResetConfirm>({
      query: (credentials: TPasswordResetConfirm) => ({
        url: '/password/reset/confirm/',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation
} = authApi; 