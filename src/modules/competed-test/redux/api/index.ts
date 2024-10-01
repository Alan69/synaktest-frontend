import baseApi from '../../../../redux/api/index';

export interface TTestResponse {
  id: string
  user: TUser
  product: Troduct
  completed_at: string
  completed_questions: TCompletedQuestion[]
}

export interface TUser {
  id: number
  username: string
}

export interface Troduct {
  id: string
  title: string
}

export interface TCompletedQuestion {
  id: string
  question: TQuestion
  selected_option: TSelectedOption
}

export interface TQuestion {
  id: string
  text: string
  options: TOption[]
}

export interface TOption {
  id: string
  text: string
  is_correct: string
}

export interface TSelectedOption {
  id: string
  text: string
  is_correct: string
}


export const completedTestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompletedTestList: build.query<TTestResponse[], void>({
			query: () => ({
				url: '/completed-tests/',
				method: 'GET'
			}),
			transformResponse: (response: TTestResponse[]) => response,
    }),
    getCompletedTestById: build.query<TTestResponse, string | undefined>({
			query: (id) => ({
				url: `/completed-tests/${id}/`,
				method: 'GET'
			}),
			transformResponse: (response: TTestResponse) => response,
    }),
  }),
	overrideExisting: false,
});

export const { useGetCompletedTestListQuery, useGetCompletedTestByIdQuery } = completedTestApi;