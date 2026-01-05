export const getRankingBorderWrapper = (tier) => {
  const base = {
    padding: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#525252", // gray-600
  };

  if (!tier) return base;

  switch (tier.toLowerCase()) {
    case "bronze":
      return {
        ...base,
        borderWidth: 2,
        borderColor: "#b45309", // amber-700
      };

    case "silver":
      return {
        ...base,
        borderWidth: 2,
        borderColor: "#d1d5db", // gray-300
      };

    case "gold":
      return {
        ...base,
        borderWidth: 2,
        borderColor: "#facc15", // yellow-400
      };

    case "diamond":
      return {
        ...base,
        borderWidth: 2,
        borderColor: "#3b82f6", // blue-500

        // ✨ glow equivalente al shadow de Tailwind
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.95,
        shadowRadius: 16,
        elevation: 10, // Android
      };

    default:
      return base;
  }
};
