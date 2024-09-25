import baseApi from ".";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: () => '/products/',
    }),
    fetchProduct: builder.query({
      query: (productId) => `products/${productId}/`,
    }),
    fetchTests: builder.query({
      query: (productId) => `tests/?product=${productId}`,
    }),
    purchaseProduct: builder.mutation({
      query: (productId) => ({
        url: `products/${productId}/purchase/`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useFetchProductsQuery, useFetchProductQuery, useFetchTestsQuery, usePurchaseProductMutation } = productApi;
export default productApi;
