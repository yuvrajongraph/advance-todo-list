import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers,{getState}) => {
    const token = getState().users?.user?.token;
    if(!token) return headers;
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
}); 

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/signin",
        method: "POST",
        body: { email, password },
      }),
    }),
    registerUser: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "/auth/signup",
        method: "POST",
        body: { name, email, password },
      }),
    }),
    registerUserVerification: builder.mutation({
      query: (token) => ({
        url: "/auth/signup",
        method: "GET",
        params: {
          token: token,
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({token,oldPassword,newPassword}) => ({
        url: "/auth/reset-password",
        method: "POST",
        params: {
          token: token,
        },
        body:{oldPassword, newPassword}
      }),
    }),
    resetPasswordMail: builder.mutation({
      query: () => ({
        url: "/auth/reset-password",
        method: "GET",
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/signout",
        method: "POST",
      }),
    }),
    googleAuth: builder.mutation({
      query: () => ({
        url: "/auth/google",
        method: "GET",
      }),
    }),
    googleContact: builder.query({
      query: () => ({
        url: "/auth/google/contact",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useRegisterUserVerificationMutation, useResetPasswordMutation, useResetPasswordMailMutation, useGoogleAuthMutation, useLogoutUserMutation, useGoogleContactQuery } = authApi;
