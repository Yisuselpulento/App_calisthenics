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

/* -------------------- GET USER SKILLS -------------------- */
export const getUserSkillsService = async () =>
  handleRequest(axiosInstance.get("/api/user-skills"));

/* -------------------- ADD SKILL VARIANT -------------------- */
export const addSkillVariantService = async (formData) =>
  handleRequest(
    axiosInstance.post("/api/user-skills/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );

/* -------------------- EDIT SKILL VARIANT -------------------- */
export const editSkillVariantService = async (userSkillVariantId, formData) =>
  handleRequest(
    axiosInstance.put(
      `/api/user-skills/edit/${userSkillVariantId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
  );

/* -------------------- DELETE SKILL VARIANT -------------------- */
export const deleteSkillVariantService = async (userSkillVariantId) =>
  handleRequest(
    axiosInstance.delete(`/api/user-skills/delete/${userSkillVariantId}`)
  );

/* -------------------- TOGGLE FAVORITE SKILL -------------------- */
export const toggleFavoriteSkillService = async (userSkillVariantId) =>
  handleRequest(
    axiosInstance.post(`/api/user-skills/favorites/${userSkillVariantId}`)
  );

/* -------------------- GET FAVORITE SKILLS -------------------- */
export const getFavoriteSkillsService = async () =>
  handleRequest(axiosInstance.get("/api/user-skills/favorites"));

/* -------------------- GET USER SKILL BY ID -------------------- */
export const getUserSkillVariantService = async (userSkillVariantId) =>
  handleRequest(axiosInstance.get(`/api/user-skills/skill/variant/${userSkillVariantId}`));
