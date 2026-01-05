import axiosInstance from "../helpers/axiosConfig.js";

const handleRequest = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
    };
  }
};
/* fcdscsdcd */
/* ---------------------- GET FOLLOWERS ---------------------- */
export const getFollowersService = async (userId) =>
  handleRequest(axiosInstance.get(`/api/user-follow/${userId}/followers`));

/* ---------------------- GET FOLLOWING ---------------------- */
export const getFollowingService = async (userId) =>
  handleRequest(axiosInstance.get(`/api/user-follow/${userId}/following`));

/* ---------------------- TOGGLE FOLLOW ---------------------- */
export const toggleFollowService = async (userId) =>
  handleRequest(axiosInstance.post(`/api/user-follow/${userId}/toggle-follow`));
