import baseApi from ".";

const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query({
      query: () => ({
        url: '/user/',
        method: 'GET',
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

export const { useGetUserProfileQuery, useAddBalanceMutation } = profileApi;
