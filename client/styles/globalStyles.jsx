import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const useGlobalStyles = () => {
  const { COLORS, FONT, SIZES } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: SIZES.medium,
      backgroundColor: COLORS.white,
    },
    title: {
      fontSize: SIZES.xLarge,
      fontFamily: FONT.bold,
      color: COLORS.primary,
      marginBottom: SIZES.medium,
    },
    content: {
      fontSize: SIZES.medium,
      fontFamily: FONT.regular,
      color: COLORS.gray,
      lineHeight: 1.5 * SIZES.medium,
      marginBottom: SIZES.large,
    },
    button: {
      backgroundColor: COLORS.tertiary,
      padding: SIZES.small,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: SIZES.medium,
      fontFamily: FONT.medium,
      color: COLORS.white,
      textAlign: 'center',
    },
    newsSection: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 20,
    },
    newsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  });
};
