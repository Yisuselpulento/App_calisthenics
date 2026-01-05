import axiosInstance from "../helpers/axiosConfig.js";

const handleRequest = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    console.log("💥 Axios error:", error); // <-- DEBUG
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
    };
  }
};

export const signupService = async (userData) =>
  handleRequest(axiosInstance.post("/api/auth/signup", userData));

/* -------------------------- LOGIN -------------------------- */
export const loginService = async (userData) =>
  handleRequest(axiosInstance.post("/api/auth/login", userData));


/* -------------------------- CHECK AUTH (RESTORE SESSION) -------------------------- */
export const checkAuthService = async () =>
  handleRequest(axiosInstance.get("/api/auth/check-auth"));

/* -------------------------- FORGOT PASSWORD -------------------------- */
export const forgotPasswordFetching = async (userData) =>
  handleRequest(axiosInstance.post("/api/auth/forgot-password", userData));

/* -------------------------- RESET PASSWORD -------------------------- */
export const updatePasswordFetching = async (newPassword, token) =>
  handleRequest(
    axiosInstance.post(`/api/auth/reset-password/${token}`, newPassword)
  );

/* -------------------------- VERIFY EMAIL -------------------------- */
export const emailVerificationFetching = async (code) =>
  handleRequest(axiosInstance.post("/api/auth/verify-email", code));

/* -------------------------- RESEND TOKEN -------------------------- */
export const resendTokenFetching = async () =>
  handleRequest(axiosInstance.post("/api/auth/resend-verification-token"));