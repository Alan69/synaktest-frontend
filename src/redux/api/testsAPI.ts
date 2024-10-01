import baseApi from ".";

const testsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    fetchOptions: build.query({
      query: () => ({
        url: 'options/',
        method: 'GET'
      }),
    }),
    submitResult: build.mutation({
      query: (resultData) => ({
        url: `submit/`,
        method: 'POST',
        body: resultData,
      }),
    }),
    fetchTestResults: build.query({
      query: (testId) => `results/${testId}/`,
    }),
  }),
});

export const {
  useFetchOptionsQuery,
  useSubmitResultMutation,
  useFetchTestResultsQuery, 
} = testsApi;

export default testsApi;
