export const getRankingColor = (tier) => {
  if (!tier) return "#9CA3AF"; // gray

  switch (tier.toLowerCase()) {
    case "bronze":
      return "#92400E"; // bronce
    case "silver":
      return "#D1D5DB"; // plata
    case "gold":
      return "#FACC15"; // oro
    case "diamond":
      return "#38BDF8"; // azul diamante
    default:
      return "#9CA3AF";
  }
};
