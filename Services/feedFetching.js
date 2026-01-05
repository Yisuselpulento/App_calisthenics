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
export const getFeedEventsService = async (page = 1, limit = 20) =>
  handleRequest(
    axiosInstance.get(`/api/feed?page=${page}&limit=${limit}`)
  );
