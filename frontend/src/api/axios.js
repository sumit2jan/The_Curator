import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/blog",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  }
});

export const sendSignupOTP = (data) => api.post("/auth/signup/send-otp", data); // 1 sign up step.
export const verifySignupOTP = (data) => api.post("/auth/signup/verify-create", data); // 2 step of sign  verify the otp and create the user.
export const resendSignupOTP = (data) => api.post("/auth/signup/Resend-otp", data);// 3 step resend the sign up otp

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
