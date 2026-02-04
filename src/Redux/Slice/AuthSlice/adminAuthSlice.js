import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      const { admin, accessToken, refreshToken, token } = action.payload;

      if (admin) {
        state.adminInfo = {
          ...admin,
          token: accessToken || token, // Support both field names
          refreshToken: refreshToken,
        };
      } else {
        // Token refresh case
        state.adminInfo = {
          ...state.adminInfo,
          token: accessToken || token,
          refreshToken: refreshToken || state.adminInfo?.refreshToken,
        };
      }

      localStorage.setItem("adminInfo", JSON.stringify(state.adminInfo));
    },
    logoutAdmin: (state) => {
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
  },
});

export const { setAdminCredentials, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
