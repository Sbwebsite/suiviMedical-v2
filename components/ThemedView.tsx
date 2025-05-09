import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View as DefaultView } from 'react-native';

export type ThemedViewProps = DefaultView['props'];

export function ThemedView(props: ThemedViewProps) {
  const { style, ...otherProps } = props;
  const colorScheme = useColorScheme();

  return (
    <DefaultView
      style={[
        {
          backgroundColor: Colors[colorScheme].background,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
