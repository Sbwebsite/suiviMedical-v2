/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2196f3';
const tintColorDark = '#90caf9';

export default {
  light: {
    text: '#1565c0',
    background: '#f0f8ff',
    tint: tintColorLight,
    tabIconDefault: '#90caf9',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    cardBorder: '#2196f3',
    primary: '#2196f3',
    secondary: '#1976d2',
    accent: '#1565c0',
    success: '#00C851',
    warning: '#ffa726',
    error: '#e53935',
    input: '#ffffff',
    inputBorder: '#90caf9',
    button: '#2196f3',
    buttonText: '#ffffff',
  },
  dark: {
    text: '#e3f2fd',
    background: '#1a237e',
    tint: tintColorDark,
    tabIconDefault: '#3949ab',
    tabIconSelected: tintColorDark,
    card: '#283593',
    cardBorder: '#3949ab',
    primary: '#2196f3',
    secondary: '#1976d2',
    accent: '#90caf9',
    success: '#00C851',
    warning: '#ffa726',
    error: '#e53935',
    input: '#283593',
    inputBorder: '#3949ab',
    button: '#2196f3',
    buttonText: '#ffffff',
  },
};
