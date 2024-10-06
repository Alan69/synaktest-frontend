import baseApi from '../../../../redux/api/index';

export type TAllOptions = {
  id: string;
  text: string;
}

export type TQuestions = {
  id: string;
  question_text: string;
  selected_option: string | null;
  all_options: TAllOptions
}

export type TTest = {
  id: string;
  title: string;
  total_correct_by_test: number;
  total_incorrect_by_test: number;  
  questions: TQuestions[];
}

export interface TProduct {
  id: string;
  title: string;
  total_correct_by_all_tests: number;
  total_incorrect_by_all_tests: number;
  tests: TTest[];
}

export interface TCompletedTestResponse {
  id: string;
  finish_test_time: string | null;
  start_test_time: string | null;
  user: string;
  product: TProduct;
}

export const completedTestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompletedTestList: build.query<TCompletedTestResponse[], void>({
			query: () => ({
				url: '/completed-tests/',
				method: 'GET'
			}),
			transformResponse: (response: TCompletedTestResponse[]) => response,
    }),
    getCompletedTestById: build.query<TCompletedTestResponse, string | undefined>({
			query: (id) => ({
				url: `/completed-tests/${id}/`,
				method: 'GET'
			}),
			transformResponse: (response: TCompletedTestResponse) => response,
    }),
  }),
	overrideExisting: false,
});

export const { useGetCompletedTestListQuery, useGetCompletedTestByIdQuery } = completedTestApi;