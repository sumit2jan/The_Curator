import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/thecurator",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});


// ─────────────────────────────────────────────
// 🔐 AUTH ROUTES
// ─────────────────────────────────────────────
export const sendSignupOTP = (data) => api.post("/auth/signup/send-otp", data);
export const verifySignupOTP = (data) => api.post("/auth/signup/verify-create", data);
export const resendSignupOTP = (data) => api.post("/auth/signup/Resend-otp", data);

export const verifyOTP = (data) => api.post("/auth/verifyUser", data);
export const resendVerifyOTP = (data) => api.post("/auth/resendVerifyOTP", data);


// ─────────────────────────────────────────────
// 📤 REQUEST INTERCEPTOR (Attach Token)
// ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  try {
    const persistRoot = localStorage.getItem("persist:root");

    if (persistRoot) {
      const parsedRoot = JSON.parse(persistRoot);

      if (parsedRoot.auth) {
        const auth = JSON.parse(parsedRoot.auth);

        const token = auth?.token; // ✅ YOUR KEY

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
  } catch (err) {
    console.error("Token parse error:", err);
  }

  return config;
});


// ─────────────────────────────────────────────
// 🔁 SILENT REFRESH LOGIC
// ─────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};


// ─────────────────────────────────────────────
// 📥 RESPONSE INTERCEPTOR (Handle 401)
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const persistRoot = localStorage.getItem("persist:root");

        if (!persistRoot) throw new Error("No auth data");

        const parsedRoot = JSON.parse(persistRoot);
        const auth = JSON.parse(parsedRoot.auth);

        const refreshToken = auth?.refreshToken;

        if (!refreshToken) throw new Error("No refresh token");

        // 🔥 CALL REFRESH API (use axios, NOT api)
        const { data } = await axios.post(
          "http://localhost:5000/thecurator/auth/refresh",
          { refreshToken }
        );

        const newToken = data.data.token;
        const newRefreshToken = data.data.refreshToken;

        // 🔥 UPDATE LOCAL STORAGE (Redux Persist)
        const updatedAuth = {
          ...auth,
          token: newToken,
          refreshToken: newRefreshToken,
        };

        parsedRoot.auth = JSON.stringify(updatedAuth);
        localStorage.setItem("persist:root", JSON.stringify(parsedRoot));

        // 🔁 resolve all queued requests
        processQueue(null, newToken);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);

        // ❌ ONLY if refresh fails → logout
        localStorage.removeItem("persist:root");

        console.warn("Session expired. Please login again.");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default api;
/* 
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/thecurator",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  }
});

// Signup Routes
export const sendSignupOTP = (data) => api.post("/auth/signup/send-otp", data); // 1 sign up step.
export const verifySignupOTP = (data) => api.post("/auth/signup/verify-create", data); // 2 step of sign  verify the otp and create the user.
export const resendSignupOTP = (data) => api.post("/auth/signup/Resend-otp", data);// 3 step resend the sign up otp

// Login Routes
export const verifyOTP = (data) => api.post("/auth/verifyUser", data);// otp verify krne ke lie
export const resendVerifyOTP = (data) => api.post("/auth/resendVerifyOTP", data); // otp resnd krne ke lie




// yha se headers mai token bhej rahe hai jo sbb log access kre hai
api.interceptors.request.use((config) => {
  const persistRoot = localStorage.getItem("persist:root");
  if (persistRoot) {
    const auth = JSON.parse(JSON.parse(persistRoot).auth);
    const token = auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api





 */




// 🔥 IMPORTANT (DO NOT CHANGE THIS FLOW)
//
// We DO NOT send userId from frontend for fetching own profile.
// Reason:
// - JWT token already contains user identity
// - Backend extracts user from req.user (authMiddleware)
// - More secure (prevents ID tampering)
//
// Use:
// 👉 GET /profile        → for logged-in user's own profile
// 👉 GET /profile/:id    → only for admin or public profile view
//
// ❌ Avoid:
// API.get("/profile/" + userId)  ← unnecessary & unsafe
//
// ✔ Correct:
