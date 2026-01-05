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


/* ---------------------------- CREATE COMBO ---------------------------- */
export const createComboService = async (comboData) => 
  handleRequest(
    axiosInstance.post("/api/combos", comboData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );

/* ---------------------------- GET USER COMBOS ---------------------------- */
export const getUserCombosService = async () =>
  handleRequest(axiosInstance.get("/api/combos"));

/* ---------------------------- GET COMBO BY ID ---------------------------- */
export const getComboByIdService = async (comboId) =>
  handleRequest(axiosInstance.get(`/api/combos/${comboId}`));

/* ---------------------------- UPDATE COMBO ---------------------------- */
export const updateComboService = async (comboId, updatedData) =>
  handleRequest(
    axiosInstance.put(`/api/combos/${comboId}`, updatedData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );

/* ---------------------------- DELETE COMBO ---------------------------- */
export const deleteComboService = async (comboId) =>
  handleRequest(axiosInstance.delete(`/api/combos/${comboId}`));

/* ---------------------------- TOGGLE FAVORITE COMBO ---------------------------- */
export const toggleFavoriteComboService = async (comboId, type) =>
  handleRequest(
    axiosInstance.post(`/api/combos/favorite/${comboId}`, { type })
  );
