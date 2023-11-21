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
      invalidatesTags: ["todos"],
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
      invalidatesTags: ["todos"],
    }),
    getSingleAppointment: builder.query({
      query: ({ id }) => ({
        url: `/appointment/${id}`,
        method: "GET",
      }),
      providesTags: ["todos"],
    }),
    getAllAppointments: builder.query({
      query: () => ({
        url: `/appointment`,
        method: "GET",
      }),
      providesTags: ["todos"],
    }),
    deleteAppointment: builder.mutation({
      query: ({ id }) => ({
        url: `/appointment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["todos"],
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
