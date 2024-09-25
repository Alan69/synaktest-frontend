import baseApi from ".";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: '/user/',
        method: 'GET',
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (updatedData) => ({
        url: '/user/',
        method: 'PUT',
        body: updatedData,
      }),
    }),
    addBalance: builder.mutation({
      query: () => ({
        url: '/payments/add-balance/',
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useAddBalanceMutation } = profileApi;
