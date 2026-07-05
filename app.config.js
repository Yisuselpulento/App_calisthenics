import 'dotenv/config';

export default {
  expo: {
    name: "calistenia_app",
    slug: "calisthenicsfrontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "calisteniaapp",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    runtimeVersion: { policy: "fingerprint" },

    android: {
      package: "com.monssterdc.calisteniaapp",
      googleServicesFile: "./google-services.json",
      useNextNotificationsApi: true,
      permissions: ["POST_NOTIFICATIONS"],

      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundColor: "#E6F4FE",
      },

      notification: {
        icon: "./assets/images/notification-icon.png",
        color: "#E6F4FE",
      },
    },

    plugins: [
      "./plugins/withDisableForcedDark",
      "expo-router",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          defaultChannel: "default",
          icon: "./assets/images/notification-icon.png",
          color: "#E6F4FE",
        },
      ],
    ],

    extra: {
      eas: {
        projectId: "3e704fd5-bf0b-48e3-b7b9-4fad10d007d7",
      },
    },

    updates: {
      enabled: true,
      url: "https://u.expo.dev/3e704fd5-bf0b-48e3-b7b9-4fad10d007d7",
      channel: "production",
    },
  },
};
