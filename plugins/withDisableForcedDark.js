const { withAndroidStyles, AndroidConfig } = require("@expo/config-plugins");

/**
 * Fuerza a Android a NO aplicar "dark mode para todas las apps".
 * Añade android:forceDarkAllowed=false al tema principal, así los colores
 * hardcodeados de la app se ven siempre igual, sin importar el tema del teléfono.
 */
module.exports = function withDisableForcedDark(config) {
  return withAndroidStyles(config, (cfg) => {
    cfg.modResults = AndroidConfig.Styles.assignStylesValue(cfg.modResults, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeGroup(),
      name: "android:forceDarkAllowed",
      value: "false",
    });
    return cfg;
  });
};
