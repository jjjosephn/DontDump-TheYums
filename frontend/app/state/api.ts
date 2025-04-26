import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
   reducerPath: 'api',
   tagTypes: [],
   endpoints: (build) => ({
      // Recipes
      complexRecipeSearch: build.mutation({
        query: ({ terms, number }) => ({
          url: '/recipes/complex', // backend endpoint
          method: 'GET',
          params: { terms, number }, // params
        }),
      }),

      ingredientRecipeSearch: build.mutation({
        query: ({ ingredients, number }) => ({
          url: '/recipes/byIng', // backend endpoint
          method: 'GET',
          params: { ingredients, number }, // params
        }),
      }),

      // Ingredients
      fetchIngredients: build.query({
        query: (query) => ({
          url: '/ingredients/info', 
          method: 'GET',
          params: { query }, 
        }),
      }),
      addIngredient: build.mutation({
        query: (ingredient) => ({
          url: '/ingredients/add',
          method: 'POST',
          body: ingredient,
        })
      }),
      getAllIngredients: build.query({
        query: (userId) => ({
          url: `/ingredients/${userId}`,
          method: 'GET',
        }),
      }),
      deleteIngredient: build.mutation({
        query: (id) => ({
          url: `/ingredients/delete/${id}`,
          method: 'DELETE',
        }),
      }),

      // User
      checkUser: build.mutation<any, {userId: string}>({
        query: (body) => ({
          url: '/user/checkUser',
          method: 'POST',
          body
        }),
      }),
    }),
});

export const { 
  useComplexRecipeSearchMutation,
  useIngredientRecipeSearchMutation,
  useFetchIngredientsQuery,
  useAddIngredientMutation,
  useGetAllIngredientsQuery,
  useDeleteIngredientMutation,
  useCheckUserMutation,
} = api;
