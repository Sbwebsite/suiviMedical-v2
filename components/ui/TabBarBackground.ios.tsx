import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export function TabBarBackground() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme].tint;

  return (
    <BlurView
      tint={colorScheme}
      intensity={80}
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: Colors[colorScheme].background,
          borderTopWidth: 1,
          borderTopColor: Colors[colorScheme].cardBorder,
        },
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
