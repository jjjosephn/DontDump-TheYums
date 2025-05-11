import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
   reducerPath: 'api',
   tagTypes: [],
   endpoints: (build) => ({
      // Recipes
      complexRecipeSearch: build.query({
        query: ({ terms, number }) => ({
          url: '/recipes/complex', // backend endpoint
          method: 'GET',
          params: { terms, number }, // params
        }),
      }),

      ingredientRecipeSearch: build.query({
        query: ({ ingredients, number }) => ({
          url: '/recipes/byIng', // backend endpoint
          method: 'GET',
          params: { ingredients, number }, // params
        }),
      }),

      getIngredientsFilter: build.query({
        query: (userId) => ({
          url: `/recipes/getIng/${userId}`,
          method: 'GET',
        }),
      }),

      bookmarkRecipe: build.mutation({
        query: (recipe) => ({
          url: '/recipes/bookmark',
          method: 'POST',
          body: recipe,
        }),
      }),

      unbookmarkRecipe: build.mutation({
        query: ({userId, recipeId}) => ({
          url: `/recipes/unbookmark/${userId}/${recipeId}`,
          method: 'DELETE',
        }),
      }),

      getAllRecipes: build.query({
        query: (userId) => ({
          url: `/recipes/bookmarks/${userId}`, // backend endpoint
          method: 'GET',
          params: { userId }, // params
        }),
      }),

      getRecipeDetail: build.query({
        query: (id) => ({
          url: `/recipes/${id}`, // backend endpoint
          method: 'GET',
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

      fetchDisposalTip: build.query({
        query: (name) => ({
          url: '/ingredients/tip/fetch',
          method: 'GET',
          params: { name }
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
  useComplexRecipeSearchQuery,
  useIngredientRecipeSearchQuery,
  useGetIngredientsFilterQuery,
  useBookmarkRecipeMutation,
  useUnbookmarkRecipeMutation,
  useGetAllRecipesQuery,
  useGetRecipeDetailQuery,
  useFetchIngredientsQuery,
  useAddIngredientMutation,
  useGetAllIngredientsQuery,
  useDeleteIngredientMutation,
  useFetchDisposalTipQuery,
  useCheckUserMutation,
} = api;
