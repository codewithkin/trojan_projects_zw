import React, { createContext, useCallback, useContext, useMemo } from "react";
import { Uniwind, useUniwind } from "uniwind";

type ThemeName = "light" | "dark";

type AppThemeContextType = {
  currentTheme: string;
  isLight: boolean;
  isDark: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Force light theme to match web app (no dark mode)
  React.useEffect(() => {
    Uniwind.setTheme("light");
  }, []);

  const { theme } = useUniwind();

  const isLight = useMemo(() => {
    return true; // Always light mode
  }, []);

  const isDark = useMemo(() => {
    return false; // Never dark mode
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    // Only allow light theme
    if (newTheme === "light") {
      Uniwind.setTheme(newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    // Do nothing - theme is locked to light
  }, []);

  const value = useMemo(
    () => ({
      currentTheme: "light",
      isLight,
      isDark,
      setTheme,
      toggleTheme,
    }),
    [isLight, isDark, setTheme, toggleTheme],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}
