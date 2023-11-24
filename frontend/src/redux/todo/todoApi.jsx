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
  let result = await baseQuery(args, api, extraOptions);
  return result;
};

export const todoApi = createApi({
  reducerPath: "todoApi",
  tagTypes: ["todos"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createTodoItem: builder.mutation({
      query: ({ title, status, category, dateTime }) => ({
        url: `/todo-list`,
        method: "POST",
        body: {
          title,
          status,
          category,
          dateTime
        },
      }),
      invalidatesTags: ["todos"],
    }),
    updateTodoItem: builder.mutation({
      query: ({ id, title, status, category, dateTime }) => ({
        url: `/todo-list/${id}`,
        method: "PATCH",
        body: {
          title,
          status,
          category,
          dateTime,
        },
      }),
      invalidatesTags: ["todos"],
    }),
    getSingleTodoItem: builder.query({
      query: ({ id }) => ({
        url: `/todo-list/${id}`,
        method: "GET",
      }),
      providesTags: ["todos"],
    }),
    getAllTodoItems: builder.mutation({
      query: () => ({
        url: `/todo-list`,
        method: "GET",
      }),
      
    }),
    deleteTodoItem: builder.mutation({
      query: ({ id }) => ({
        url: `/todo-list/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["todos"],
    }),
  }),
});

export const {
  useCreateTodoItemMutation,
  useUpdateTodoItemMutation,
  useDeleteTodoItemMutation,
  useGetAllTodoItemsMutation,
  useGetSingleTodoItemQuery,
} = todoApi;
