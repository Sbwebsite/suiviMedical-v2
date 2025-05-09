import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text as DefaultText } from 'react-native';

export type ThemedTextProps = DefaultText['props'];

export function ThemedText(props: ThemedTextProps) {
  const { style, ...otherProps } = props;
  const colorScheme = useColorScheme();

  return (
    <DefaultText
      style={[
        {
          color: Colors[colorScheme].text,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
