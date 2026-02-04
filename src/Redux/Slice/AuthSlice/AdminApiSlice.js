import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAdminCredentials, logoutAdmin } from "./adminAuthSlice";
import backendURL from "../../../config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/auth/admin`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

// Endpoints that should NOT trigger token refresh on 401
const AUTH_ENDPOINTS = [
  "adminLogin",
  "adminSignup",
  "verifyAdminEmail",
  "resendAdminVerification",
  "forgotAdminPassword",
  "resetAdminPassword",
  "refreshAdminToken",
];

const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log("🔍 Admin RTK Query Request:", {
    endpoint: api.endpoint,
    url: typeof args === "string" ? args : args.url,
    method: typeof args === "object" ? args.method : "GET",
  });

  let result = await baseQuery(args, api, extraOptions);
  const endpoint = api.endpoint;

  // Don't retry auth endpoints
  if (AUTH_ENDPOINTS.includes(endpoint)) {
    console.log(`✅ Admin auth endpoint '${endpoint}' - no retry`);
    return result;
  }

  // If we get 401, try to refresh token
  if (result?.error?.status === 401) {
    console.log("🔄 Admin 401 detected, attempting token refresh...");

    const refreshResult = await baseQuery(
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
      errorStatus: refreshResult?.error?.status,
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

export const adminAPISlice = createApi({
  reducerPath: "adminAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    // Admin signup
    adminSignup: builder.mutation({
      query: (data) => ({
        url: "signup",
        method: "POST",
        body: data,
      }),
    }),

    // Admin login
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Verify admin email
    verifyAdminEmail: builder.mutation({
      query: (token) => ({
        url: `verify-email?token=${token}`,
        method: "GET",
      }),
    }),

    // Resend verification email
    resendAdminVerification: builder.mutation({
      query: (email) => ({
        url: "resend-verification",
        method: "POST",
        body: { email },
      }),
    }),

    // Forgot password
    forgotAdminPassword: builder.mutation({
      query: (email) => ({
        url: "forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // Reset password
    resetAdminPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `reset-password?token=${token}`,
        method: "POST",
        body: { password, confirm_password: confirmPassword },
      }),
    }),

    // Refresh token
    refreshAdminToken: builder.mutation({
      query: (body) => ({
        url: "refresh-token",
        method: "POST",
        credentials: "include",
        ...(body && { body }),
      }),
    }),

    // Logout
    logoutAdmin: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAdminSignupMutation,
  useAdminLoginMutation,
  useVerifyAdminEmailMutation,
  useResendAdminVerificationMutation,
  useForgotAdminPasswordMutation,
  useResetAdminPasswordMutation,
  useRefreshAdminTokenMutation,
  useLogoutAdminMutation,
} = adminAPISlice;
