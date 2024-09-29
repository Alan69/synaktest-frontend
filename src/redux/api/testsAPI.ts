import baseApi from ".";

const testsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTests: build.query({
      query: (testIds) => ({
        url: `tests/?product=${testIds.join(',')}`,
        method: 'GET'
      }),
    }),
    fetchTestQuestions: build.query({
      query: (testId) => `questions/?test_id=${testId}`,
    }),
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
  useFetchTestsQuery,
  useFetchTestQuestionsQuery,
  useFetchOptionsQuery,
  useSubmitResultMutation,
  useFetchTestResultsQuery, 
} = testsApi;

export default testsApi;
