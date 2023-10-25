import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().users?.user?.token;
    if (!token) return headers;

    headers.set("Authorization", `Bearer ${token}`);
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  return result;
};

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createTodoItem: builder.mutation({
      query: ({ title, status, category, dateTime }) => ({
        url: `/todo-list`,
        method: "POST",
        body: {
          ...(title && { title }),
          ...(status && { status }),
          ...(category && { category }),
          ...(dateTime && { dateTime }),
        },
      }),
    }),
    updateTodoItem: builder.mutation({
      query: ({ id, title, status, category, dateTime }) => ({
        url: `/todo-list/${id}`,
        method: "PATCH",
        body: {
          ...(title && { title }),
          ...(status && { status }),
          ...(category && { category }),
          ...(dateTime && { dateTime }),
        },
      }),
    }),
    getSingleTodoItem: builder.mutation({
      query: ({ id }) => ({
        url: `/todo-list/${id}`,
        method: "GET",
      }),
    }),
    getAllTodoItems: builder.mutation({
      query: ({ title, status, category, dateTime }) => ({
        url: `/todo-list`,
        method: "GET",
        params: {
          ...(title && { title }),
          ...(status && { status }),
          ...(category && { category }),
          ...(dateTime && { dateTime }),
        },
      }),
    }),
    deleteTodoItem: builder.mutation({
      query: ({ id }) => ({
        url: `/todo-list/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateTodoItemMutation,
  useUpdateTodoItemMutation,
  useDeleteTodoItemMutation,
  useGetSingleTodoItemMutation,
  useGetAllTodoItemsMutation
} = todoApi;
