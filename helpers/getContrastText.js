/**
 * Devuelve "#000" o "#fff" según el brillo del color de fondo,
 * para que el texto encima siempre sea legible.
 */
export const getContrastText = (hex) => {
  if (!hex || typeof hex !== "string") return "#fff";
  const c = hex.replace("#", "");
  if (c.length < 6) return "#fff";

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // Luminancia relativa (0 = oscuro, 1 = claro)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? "#000000" : "#ffffff";
};
