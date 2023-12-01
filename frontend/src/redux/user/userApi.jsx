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
  let uploadProgress = 0; 

  
  //const {onUploadProgress, body, ...rest} = extraOptions;
  // if (onUploadProgress && body instanceof FormData) {
  //   body.forEach((value, key) => {
  //     if (value instanceof File) {
  //       uploadProgress += value.size;
  //     }
  //   });
  // }

  // const result = await baseQuery(args, {
  //   ...api,
  //   extraOptions: {
  //     ...rest,
  //     onDownloadProgress: (progressEvent) => {
  //       const loaded = progressEvent.loaded;
        
  //       const progress = Math.round((loaded / uploadProgress) * 100);
  //       extraOptions?.onUploadProgress({ loaded, total: uploadProgress, progress });
  //     },
  //   },
  // });
  const result = await baseQuery(args,api,extraOptions)
   
  
  return result;
};


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
