import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

/**
 * Provides theme state and toggle behavior for the application tree.
 * @param {{ children: React.ReactNode }} props Provider props.
 * @returns {JSX.Element} Provider wrapping the app subtree.
 */
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("qp-theme");
    return saved !== null ? saved === "dark" : false; // default to light
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("qp-theme", isDark ? "dark" : "light");
  }, [isDark]);

  /**
   * Toggles the persisted light/dark theme value.
   * @returns {void}
   */
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Returns the current theme context, enforcing provider usage.
 * @returns {{ isDark: boolean, toggleTheme: () => void }} Theme context state and mutator.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export default ThemeContext;
