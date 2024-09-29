import baseApi from ".";

const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query({
      query: () => ({
        url: '/user/',
        method: 'GET',
      }),
    }),
    updateUserProfile: build.mutation({
      query: (updatedData) => ({
        url: '/user/',
        method: 'PUT',
        body: updatedData,
      }),
    }),
    addBalance: build.mutation({
      query: () => ({
        url: '/payments/add-balance/',
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useAddBalanceMutation } = profileApi;
