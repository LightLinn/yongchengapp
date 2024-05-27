import React, { createContext, useContext } from 'react';
import { COLORS, FONT, SIZES } from '../styles/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ COLORS, FONT, SIZES }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
