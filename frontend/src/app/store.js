import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import dashBoardReducer from "../redux/dashBoard/dashboardSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig = {
  key: "root",
  storage: storage.default || storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashBoardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);





// manual wrapper
// const storage = {
//   getItem: (key) => {
//     try {
//       return Promise.resolve(localStorage.getItem(key));
//     } catch {
//       return Promise.resolve(null);
//     }
//   },
//   setItem: (key, value) => {
//     try {
//       localStorage.setItem(key, value);
//       return Promise.resolve(value);
//     } catch {
//       return Promise.resolve(null);
//     }
//   },
//   removeItem: (key) => {
//     try {
//       localStorage.removeItem(key);
//       return Promise.resolve();
//     } catch {
//       return Promise.resolve();
//     }
//   },
// };
