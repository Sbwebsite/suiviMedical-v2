import { Text, TextProps, StyleSheet } from 'react-native';
import React from 'react';

type ThemedTextProps = TextProps & {
  type?: 'title' | 'link' | 'default';
};

export const ThemedText: React.FC<ThemedTextProps> = ({ type = 'default', style, ...props }) => {
  const textStyle = [
    styles.default,
    type === 'title' && styles.title,
    type === 'link' && styles.link,
    style,
  ];

  return <Text style={textStyle} {...props} />;
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
