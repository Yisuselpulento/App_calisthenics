// services/energyFetching.js
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

/* -------------------------- GET ENERGY -------------------------- */
export const getEnergyService = async () =>
  handleRequest(axiosInstance.get("/api/energy"));

/* -------------------------- BUY ENERGY BOOST -------------------------- */
export const buyEnergyBoostService = async () =>
  handleRequest(axiosInstance.post("/api/energy/boost"));

/* -------------------------- BUY FULL ENERGY -------------------------- */
export const buyFullEnergyService = async () =>
  handleRequest(axiosInstance.post("/api/energy/full"));
