import baseApi from ".";

const testsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchTests: builder.query({
      query: (testIds) => ({
        url: `tests/?product=${testIds.join(',')}`,
        method: 'GET'
      }),
    }),
    fetchTestQuestions: builder.query({
      query: (testId) => `questions/?test_id=${testId}`,
    }),
    fetchOptions: builder.query({
      query: () => ({
        url: 'options/',
        method: 'GET'
      }),
    }),
    submitResult: builder.mutation({
      query: (resultData) => ({
        url: `submit/`,
        method: 'POST',
        body: resultData,
      }),
    }),
    fetchTestResults: builder.query({
      query: (testId) => `results/${testId}/`,
    }),
  }),
});

export const {
  useFetchTestsQuery,
  useFetchTestQuestionsQuery,
  useFetchOptionsQuery,
  useSubmitResultMutation,
  useFetchTestResultsQuery, 
} = testsApi;

export default testsApi;
