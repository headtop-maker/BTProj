import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

import {IPost} from '../types/types';

export const deviceApi = createApi({
  reducerPath: 'deviceApi',
  baseQuery: fetchBaseQuery({baseUrl: 'https://jsonplaceholder.typicode.com/'}),
  endpoints: build => ({
    fetchAlls: build.query<IPost[], number>({
      query: (limit: number = 5) => ({
        url: `/posts`,
        params: {
          _limit: limit,
        },
      }),
    }),
  }),
});

export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fir-educationbase-default-rtdb.firebaseio.com/',
  }),
  tagTypes: ['Devs'],
  endpoints: build => ({
    fetchAlls: build.query({
      query: () => ({
        url: '/devices.json',
      }),
      providesTags: ['Devs'],
    }),
    putDev: build.mutation({
      query: devs => ({
        url: '/devices.json',
        method: 'PUT',
        body: {dev_1: devs},
      }),
    }),
    postDev: build.mutation({
      query: postData => ({
        url: '/devices.json',
        method: 'POST',
        body: postData,
      }),
    }),
    patchDev: build.mutation({
      query: postData => ({
        url: '/devices.json',
        method: 'PATCH',
        body: postData,
      }),
      invalidatesTags: ['Devs'],
    }),
  }),
});
