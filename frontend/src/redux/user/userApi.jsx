import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().users?.user?.token;
    if (!token) return headers;
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  
  const result = await baseQuery(args,api,extraOptions)
  return result;
};

// create the mutation and query for fetching the user route apis
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => {
        return {
          url: `/user/upload-image`,
          method: "POST",
          body: formData
        };
      },
    }),
    getSingleUser: builder.mutation({
        query: () => {
          return {
            url: `/user`,
            method: "GET"
          };
        },
      }),
  }),
});

export const { useUploadImageMutation, useGetSingleUserMutation } = userApi;
