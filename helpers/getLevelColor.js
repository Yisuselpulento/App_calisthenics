export const getLevelColor = (user) => {
  const colors = [
    "#ffffff", // white
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#eab308", // yellow
  ];

  if (!user || !user.stats) return colors[0];

  const mainAura = user.stats.mainAura || 0;

  const index = Math.floor(mainAura / 4500) % colors.length;

  return colors[index];
};
