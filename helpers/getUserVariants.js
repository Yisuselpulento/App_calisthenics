/**
 * Transforma un array de UserSkills en un array plano de variantes enriquecidas
 * @param {Array} userSkills - Array de UserSkill poblados con Skill
 * @returns {Array} Array de variantes con info de userSkill y skill
 */
export const getUserVariants = (userSkills = []) => {
  return userSkills.flatMap((userSkill) =>
    userSkill.variants.map((variant) => ({
      userSkillVariantId: variant.userSkillVariantId,// ID de la variante del usuario
      userSkillId: userSkill.userSkillId,   // ID del UserSkill
      skillId: userSkill.skillId,     // ID de la Skill base
      skillName: userSkill.skillName,  // Nombre de la Skill base
      variantKey: variant.variantKey,
      fingers: variant.fingers,
      video: variant.video,
      lastUpdated: variant.lastUpdated,
      name: variant.name || variant.variantKey,
      type: variant.type || "static",
      stats: variant.stats || {},
      staticAU: variant.staticAU || 0,
      dynamicAU: variant.dynamicAU || 0,
      difficulty: variant.difficulty || "basic",
    }))
  );
};
