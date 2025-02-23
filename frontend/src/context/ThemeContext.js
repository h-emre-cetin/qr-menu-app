import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primary: '#4A90E2',
    secondary: '#F5A623',
    background: '#FFFFFF',
    text: '#333333'
  });

  const updateTheme = async (colors) => {
    try {
      const businessId = localStorage.getItem('businessId');
      if (!businessId) return;

      const db = getFirestore();
      const businessRef = doc(db, 'businesses', businessId);
      
      // Save theme to Firestore
      await updateDoc(businessRef, {
        theme: colors
      });

      setTheme(colors);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Load saved theme on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const businessId = localStorage.getItem('businessId');
        if (!businessId) return;

        const db = getFirestore();
        const businessRef = doc(db, 'businesses', businessId);
        const businessDoc = await getDoc(businessRef);

        if (businessDoc.exists() && businessDoc.data().theme) {
          setTheme(businessDoc.data().theme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadSavedTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);