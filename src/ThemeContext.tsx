import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  darkTheme: boolean;
  setDarkTheme: (dark: boolean) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkTheme, setDarkTheme] = useState<boolean>(true);

  // Sync theme with document roots reactively
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkTheme) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.backgroundColor = '#0F172A';
      document.body.style.backgroundColor = '#0F172A';
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.backgroundColor = '#F8FAFC';
      document.body.style.backgroundColor = '#F8FAFC';
      document.body.classList.remove('dark');
    }
  }, [darkTheme]);

  const toggleTheme = () => {
    setDarkTheme(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
