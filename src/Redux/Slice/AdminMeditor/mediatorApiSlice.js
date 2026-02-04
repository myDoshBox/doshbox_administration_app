// src/Redux/Slice/Admin/mediatorApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import backendURL from "../../../config";
import { logoutAdmin } from "../AuthSlice/adminAuthSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/admin`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().adminAuth?.adminInfo?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logoutAdmin());
    sessionStorage.setItem("admin_auth_redirect", "true");
    window.location.href = "/admin/login";
  }

  return result;
};

export const mediatorApiSlice = createApi({
  reducerPath: "mediatorApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Mediator"],
  endpoints: (builder) => ({
    // Create new mediator
    createMediator: builder.mutation({
      query: (mediatorData) => ({
        url: "/onboard-mediator",
        method: "POST",
        body: mediatorData,
      }),
      invalidatesTags: ["Mediator"],
    }),

    // Get all mediators
    getMediators: builder.query({
      query: () => "/fetch-all-mediators",
      providesTags: ["Mediator"],
    }),

    // Get single mediator
    getMediatorById: builder.query({
      query: (mediatorId) => `/getMediator-ById/${mediatorId}`,
      providesTags: (result, error, id) => [{ type: "Mediator", id }],
    }),

    // Update mediator
    updateMediator: builder.mutation({
      query: ({ id, ...mediatorData }) => ({
        url: `/update-Mediator/${id}`,
        method: "PUT",
        body: mediatorData,
      }),
      invalidatesTags: ["Mediator"],
    }),

    // Delete mediator
    deleteMediator: builder.mutation({
      query: (mediatorId) => ({
        url: `/delete-Mediator/${mediatorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mediator"],
    }),
  }),
});

export const {
  useCreateMediatorMutation,
  useGetMediatorsQuery,
  useGetMediatorByIdQuery,
  useUpdateMediatorMutation,
  useDeleteMediatorMutation,
  useLazyGetMediatorsQuery,
} = mediatorApiSlice;
