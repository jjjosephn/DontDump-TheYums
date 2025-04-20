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
    }),
});

export const { useSearchRecipesMutation } = api;
