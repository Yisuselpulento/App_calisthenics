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

/* -------------------- GET FEED EVENTS -------------------- */
export const getMatchById = async (matchId) =>
  handleRequest(axiosInstance.get(`/api/match/${matchId}`));

export const getUserRankedHistory = async (userId) =>
  handleRequest(axiosInstance.get(`/api/match/user/${userId}/ranked`));

export const getUserCasualHistory = async (userId) =>
  handleRequest(axiosInstance.get(`/api/match/user/${userId}/casual`));