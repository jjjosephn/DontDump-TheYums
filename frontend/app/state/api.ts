import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
   reducerPath: 'api',
   tagTypes: [],
   endpoints: (build) => ({
      searchRecipes: build.mutation({
        query: ({ ingredients, number }) => ({
          url: '/api/recipes', // backend endpoint
          method: 'GET',
          params: { ingredients, number }, // params
        }),
      }),
      addIngredient: build.mutation({
         query: (ingredient) => ({
           url: '/api/ingredients', // backend endpoint for adding ingredients
           method: 'POST',
           body: ingredient, // send the ingredient object in the request body
         }),
       }),
    }),   
});

export const { useSearchRecipesMutation, useAddIngredientMutation } = api;
