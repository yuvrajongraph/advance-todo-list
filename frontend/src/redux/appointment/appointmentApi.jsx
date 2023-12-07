import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// set the header before fetching the api
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().users?.user?.token;
    if (!token) return headers;
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// setting the base url and headers for necessary fetching using rtk query
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  return result;
};

// create the mutation and query for fetching the appointment apis
export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  tagTypes: ["appointments"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createAppointment: builder.mutation({
      query: ({ title, status, startTime, endTime }) => ({
        url: `/appointment`,
        method: "POST",
        body: {
          title,
          status,
          startTime,
          endTime,
          
        },
      }),
      invalidatesTags: ["appointments"],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, title, status, startTime, endTime }) => ({
        url: `/appointment/${id}`,
        method: "PATCH",
        body: {
          title,
          status,
          startTime,
          endTime
        },
      }),
      invalidatesTags: ["appointments"],
    }),
    getSingleAppointment: builder.query({
      query: ({ id }) => ({
        url: `/appointment/${id}`,
        method: "GET",
      }),
      providesTags: ["appointments"],
    }),
    getAllAppointments: builder.query({
      query: () => ({
        url: `/appointment`,
        method: "GET",
      }),
      providesTags: ["appointments"],
    }),
    deleteAppointment: builder.mutation({
      query: ({ id }) => ({
        url: `/appointment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["appointments"],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAllAppointmentsQuery,
  useGetSingleAppointmentQuery,
} = appointmentApi;
