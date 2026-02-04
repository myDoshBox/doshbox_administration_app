import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAdminCredentials, logoutAdmin } from "../AuthSlice/adminAuthSlice";
import backendURL from "../../../config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/admin/stats`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Get admin token from state
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
  console.log("🔍 Admin Stats RTK Query Request:", {
    endpoint: api.endpoint,
    url: typeof args === "string" ? args : args.url,
    method: typeof args === "object" ? args.method : "GET",
  });

  let result = await baseQuery(args, api, extraOptions);

  // If we get 401, try to refresh token
  if (result?.error?.status === 401) {
    console.log("🔄 Admin Stats 401 detected, attempting token refresh...");

    // Call the admin auth refresh endpoint
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

    console.log("🔄 Admin refresh result:", {
      status: refreshResult?.data?.status,
      hasError: !!refreshResult?.error,
    });

    if (refreshResult?.data?.status === "success") {
      console.log("✅ Admin token refreshed successfully");

      // Update Redux with new tokens
      api.dispatch(
        setAdminCredentials({
          accessToken: refreshResult.data.accessToken,
          refreshToken: refreshResult.data.refreshToken,
          admin: refreshResult.data.admin,
        }),
      );

      // Retry original request with new token
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

export const adminStatsApiSlice = createApi({
  reducerPath: "adminStatsAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "DashboardStats",
    "TransactionAnalytics",
    "DisputeAnalytics",
    "TopPerformers",
    "SystemHealth",
  ],
  endpoints: (builder) => ({
    // Get dashboard statistics
    getDashboardStats: builder.query({
      query: (timeRange = "today") => ({
        url: `/dashboard?timeRange=${timeRange}`,
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
      transformResponse: (response) => {
        console.log("✅ Dashboard stats response:", response);
        return response.data;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Dashboard stats error:", error);
        return error;
      },
    }),

    // Get transaction analytics over time
    getTransactionAnalytics: builder.query({
      query: ({ startDate, endDate, groupBy = "day" }) => ({
        url: `/transactions/analytics?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`,
        method: "GET",
      }),
      providesTags: ["TransactionAnalytics"],
      transformResponse: (response) => {
        console.log("✅ Transaction analytics response:", response);
        return response.data;
      },
    }),

    // Get dispute analytics
    getDisputeAnalytics: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/disputes/analytics?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: ["DisputeAnalytics"],
      transformResponse: (response) => {
        console.log("✅ Dispute analytics response:", response);
        return response.data;
      },
    }),

    // Get top performing vendors or mediators
    getTopPerformers: builder.query({
      query: ({ type = "vendors", limit = 10 }) => ({
        url: `/top-performing?type=${type}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "TopPerformers", id: arg.type },
      ],
      transformResponse: (response) => {
        console.log("✅ Top performers response:", response);
        return response.data;
      },
    }),

    // Get system health metrics
    getSystemHealth: builder.query({
      query: () => ({
        url: "/system-health",
        method: "GET",
      }),
      providesTags: ["SystemHealth"],
      transformResponse: (response) => {
        console.log("✅ System health response:", response);
        return response.data;
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDashboardStatsQuery,
  useGetTransactionAnalyticsQuery,
  useGetDisputeAnalyticsQuery,
  useGetTopPerformersQuery,
  useGetSystemHealthQuery,

  // Lazy query hooks (for manual triggering)
  useLazyGetDashboardStatsQuery,
  useLazyGetTransactionAnalyticsQuery,
  useLazyGetDisputeAnalyticsQuery,
  useLazyGetTopPerformersQuery,
  useLazyGetSystemHealthQuery,
} = adminStatsApiSlice;
