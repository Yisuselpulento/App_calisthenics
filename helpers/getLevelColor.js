export const getLevelColor = (user) => {
  const colors = [
    "#ffffff", // white
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#eab308", // yellow
  ];

  if (!user || !user.stats) return colors[0];

  const mainAura = user.stats.mainAura || 0;
  const MAX_AURA = 25000;
  const STEP = MAX_AURA / colors.length;

  const index = Math.min(
    colors.length - 1,
    Math.floor(mainAura / STEP)
  );

  return colors[index];
};
