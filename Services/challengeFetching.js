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

/* -------------------------- SEND CHALLENGE -------------------------- */
// Llamar a la ruta POST "/api/challenge/create"
export const sendChallengeService = async (challengeData) =>
  handleRequest(
    axiosInstance.post("/api/challenge/create", challengeData)
  );

/* -------------------------- ACCEPT CHALLENGE -------------------------- */
// Llamar a la ruta POST "/api/challenge/respond"
export const respondChallengeService = async ({ challengeId, accepted }) =>
  handleRequest(
    axiosInstance.post("/api/challenge/respond", { challengeId, accepted })
  );
/* -------------------------- CANCEL CHALLENGE -------------------------- */
// Llamar a la ruta DELETE "/api/challenge/:challengeId"
export const cancelChallengeService = async (challengeId) =>
  handleRequest(
    axiosInstance.delete(`/api/challenge/${challengeId}`)
  );