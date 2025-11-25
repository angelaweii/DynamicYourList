import React, { useEffect, createContext, useContext } from 'react';
import { generateCSSVariables, getBrandTokens } from './index';

// Create theme context
const ThemeContext = createContext({
  brand: 'max',
  setBrand: () => {}
});

/**
 * Custom hook to use theme
 */
export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Theme Provider Component
 * Injects design tokens as CSS variables into the DOM
 */
export function ThemeProvider({ children, brand = 'max' }) {
  const [currentBrand, setCurrentBrand] = React.useState(brand);

  useEffect(() => {
    // Generate and inject CSS variables
    const cssVars = generateCSSVariables(currentBrand);
    const root = document.documentElement;
    
    // Set all CSS variables
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set brand as data attribute for conditional styling
    root.setAttribute('data-brand', currentBrand);
    
    console.log(`✅ Slate Design System loaded for brand: ${currentBrand}`);
    console.log(`📦 ${Object.keys(cssVars).length} CSS variables injected`);
  }, [currentBrand]);

  const contextValue = {
    brand: currentBrand,
    setBrand: setCurrentBrand,
    tokens: getBrandTokens(currentBrand)
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;

