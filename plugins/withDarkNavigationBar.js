const { withAndroidStyles, AndroidConfig } = require("@expo/config-plugins");

/**
 * Fuerza la barra de navegación de Android a ser OSCURA con botones claros
 * en TODAS las ventanas (incluidas las de los Modales, que abren su propia
 * ventana y por defecto usaban la barra blanca del tema "light").
 */
module.exports = function withDarkNavigationBar(config) {
  return withAndroidStyles(config, (cfg) => {
    const items = [
      { name: "android:navigationBarColor", value: "#0c0a09" },
      // false = barra oscura → botones claros (blancos)
      { name: "android:windowLightNavigationBar", value: "false" },
    ];

    for (const item of items) {
      cfg.modResults = AndroidConfig.Styles.assignStylesValue(cfg.modResults, {
        add: true,
        parent: AndroidConfig.Styles.getAppThemeGroup(),
        name: item.name,
        value: item.value,
      });
    }

    return cfg;
  });
};
