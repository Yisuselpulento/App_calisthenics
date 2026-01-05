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

/* -------------------- SEARCH USERS -------------------- */
export const searchUsersService = async (query) =>
  handleRequest(axiosInstance.get(`/api/users/search?query=${query}`));

export const getRankedLeaderboardService = async (type = "static") => {
  return handleRequest(
    axiosInstance.get(`/api/users/ranked-leaderboard?type=${type}`)
  );
};
