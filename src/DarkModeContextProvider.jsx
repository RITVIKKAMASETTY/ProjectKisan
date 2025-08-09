import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Dark Mode Context
const DarkModeContext = createContext();

// Custom hook to use the Dark Mode Context
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

// Dark Mode Provider Component
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a saved preference in localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    // Otherwise, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const value = {
    isDarkMode,
    toggleDarkMode,
    setDarkMode: setIsDarkMode
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;