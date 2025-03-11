import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
   id: string
}

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
   reducerPath: 'api',
   tagTypes: ['User'],
   endpoints: (build) => ({
      addUsers: build.mutation<null, User>({
         query: (newUser) => ({
            url: '/users',
            method: 'POST',
            body: {
               id: newUser.id
            }
         }),
         invalidatesTags: ['User']
      })
   }),
});

export const {
   useAddUsersMutation,

} = api;
