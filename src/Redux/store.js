import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Feature reducers
import adminAuthReducer from "./Slice/AuthSlice/adminAuthSlice";
import mediatorReducer from "./Slice/MediatorSlice/mediatorSlice";
import mediatorDisputesReducer from "./Slice/MediatorSlice/mediatorDisputeSlice";
import { adminStatsApiSlice } from "../Redux/Slice/AdminStatSlice/Adminstatsapislice";
import { mediatorApiSlice } from "./Slice/AdminMeditor/mediatorApiSlice";
import { adminTransactionsApiSlice } from "./Slice/AdminTransactionSlice/adminTransactionsApiSlice";
// RTK Query
import { adminAPISlice } from "./Slice/AuthSlice/AdminApiSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["adminAuth"],
};

// Root reducer
const rootReducer = combineReducers({
  adminAuth: adminAuthReducer,
  mediator: mediatorReducer,
  mediatorDisputes: mediatorDisputesReducer,
  [adminAPISlice.reducerPath]: adminAPISlice.reducer,
  [adminStatsApiSlice.reducerPath]: adminStatsApiSlice.reducer,
  [mediatorApiSlice.reducerPath]: mediatorApiSlice.reducer,
  [adminTransactionsApiSlice.reducerPath]: adminTransactionsApiSlice.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      adminAPISlice.middleware,
      adminStatsApiSlice.middleware,
      adminTransactionsApiSlice.middleware,
      mediatorApiSlice.middleware,
    ),
  devTools: true,
});

// Persistor
export const persistor = persistStore(store);

// Optional reset action
export const resetAllState = () => ({ type: "RESET_ALL" });
