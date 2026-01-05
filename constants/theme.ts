/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const PRIMARY = "#3B82F6";     // 🔵 tu primary (blue-500 como en la web)
const BG_DARK = "#0c0a09";     // stone-950
const BG_SOFT = "#111827";    // stone-900-ish
const TEXT_MAIN = "#FFFFFF";
const TEXT_MUTED = "#9CA3AF";

export const Colors = {
  dark: {
    text: TEXT_MAIN,
    background: BG_DARK,
    surface: BG_SOFT,

    tint: PRIMARY,
    icon: TEXT_MUTED,

    tabIconDefault: TEXT_MUTED,
    tabIconSelected: PRIMARY,

    border: "#1f2937",
  },

  light: {
    text: "#11181C",
    background: "#ffffff",
    tint: PRIMARY,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: PRIMARY,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
