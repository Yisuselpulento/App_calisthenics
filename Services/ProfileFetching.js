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
/* -------------------------- GET PROFILE BY USERNAME -------------------------- */
export const getProfileByUsernameService = async (username) =>
  handleRequest(axiosInstance.get(`/api/profile/${username}`));

/* -------------------------- UPDATE PROFILE -------------------------- */
export const updateProfileService = async (formData) =>
  handleRequest(axiosInstance.put("/api/profile/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }));

/* -------------------------- UPDATE ADVANCED PROFILE -------------------------- */
export const updateAdvancedProfileService = async (advancedData) =>
  handleRequest(axiosInstance.put("/api/profile/update/advanced", advancedData));
