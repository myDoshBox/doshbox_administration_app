import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAdminCredentials, logoutAdmin } from "../AuthSlice/adminAuthSlice";
import backendURL from "../../../config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/admin/transactions`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().adminAuth?.adminInfo?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log(
      "🔄 Transactions API 401 detected, attempting token refresh...",
    );

    const refreshResult = await fetchBaseQuery({
      baseUrl: `${backendURL}/auth/admin`,
      credentials: "include",
    })(
      {
        url: "refresh-token",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions,
    );

    if (refreshResult?.data?.status === "success") {
      console.log("✅ Admin token refreshed successfully");

      api.dispatch(
        setAdminCredentials({
          accessToken: refreshResult.data.accessToken,
          refreshToken: refreshResult.data.refreshToken,
          admin: refreshResult.data.admin,
        }),
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("❌ Admin token refresh failed, logging out");
      api.dispatch(logoutAdmin());
      sessionStorage.setItem("admin_auth_redirect", "true");
      window.location.href = "/admin/login";
    }
  }

  return result;
};

export const adminTransactionsApiSlice = createApi({
  reducerPath: "adminTransactionsAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Transactions", "Transaction", "Payouts", "Payout"],
  endpoints: (builder) => ({
    // Get all transactions with filters
    getAllTransactions: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status,
        search,
        startDate,
        endDate,
        sortBy = "createdAt",
        sortOrder = "desc",
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        if (status) params.append("status", status);
        if (search) params.append("search", search);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return {
          url: `/transactions?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.transactions.map(({ _id }) => ({
                type: "Transactions",
                id: _id,
              })),
              { type: "Transactions", id: "LIST" },
            ]
          : [{ type: "Transactions", id: "LIST" }],
      transformResponse: (response) => {
        console.log("✅ Transactions response:", response);
        return response;
      },
    }),

    // Get single transaction by ID
    getTransactionById: builder.query({
      query: (transactionId) => ({
        url: `/transactions/${transactionId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
      transformResponse: (response) => {
        console.log("✅ Transaction details response:", response);
        return response.data;
      },
    }),

    // Get all payouts with filters
    getAllPayouts: builder.query({
      query: ({ page = 1, limit = 10, status, search, startDate, endDate }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (status) params.append("status", status);
        if (search) params.append("search", search);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return {
          url: `/payouts?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.payouts.map(({ _id }) => ({
                type: "Payouts",
                id: _id,
              })),
              { type: "Payouts", id: "LIST" },
            ]
          : [{ type: "Payouts", id: "LIST" }],
      transformResponse: (response) => {
        console.log("✅ Payouts response:", response);
        return response;
      },
    }),

    // Get single payout by ID
    getPayoutById: builder.query({
      query: (payoutId) => ({
        url: `/payouts/${payoutId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payout", id }],
      transformResponse: (response) => {
        console.log("✅ Payout details response:", response);
        return response.data || response;
      },
    }),

    // Process manual payout
    processManualPayout: builder.mutation({
      query: ({ payoutId, notes }) => ({
        url: `/payouts/${payoutId}/process-manual`,
        method: "POST",
        body: notes ? { notes } : {},
      }),
      invalidatesTags: (result, error, { payoutId }) => [
        { type: "Payout", id: payoutId },
        { type: "Payouts", id: "LIST" },
      ],
      transformResponse: (response) => {
        console.log("✅ Process manual payout response:", response);
        return response;
      },
    }),

    // Update transaction status
    updateTransactionStatus: builder.mutation({
      query: ({ transactionId, status, notes }) => ({
        url: `/transactions/${transactionId}/status`,
        method: "PATCH",
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { transactionId }) => [
        { type: "Transaction", id: transactionId },
        { type: "Transactions", id: "LIST" },
      ],
      transformResponse: (response) => {
        console.log("✅ Update transaction status response:", response);
        return response;
      },
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetAllPayoutsQuery,
  useGetPayoutByIdQuery,
  useProcessManualPayoutMutation,
  useUpdateTransactionStatusMutation,

  // Lazy queries
  useLazyGetAllTransactionsQuery,
  useLazyGetTransactionByIdQuery,
  useLazyGetAllPayoutsQuery,
  useLazyGetPayoutByIdQuery,
} = adminTransactionsApiSlice;
