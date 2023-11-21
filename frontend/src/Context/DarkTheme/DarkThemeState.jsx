import DarkThemeContext from "./DarkThemeContext";

import { useState } from "react";

const DarkThemeState = ({ children }) => {
  if (JSON.parse(sessionStorage.getItem("theme")) == null) {
    sessionStorage.setItem("theme", false);
  }
  const [dark, setDark] = useState(JSON.parse(sessionStorage.getItem("theme")));
  sessionStorage.setItem("theme", dark);
  const toggleTheme = () => {
    setDark(!dark);
    sessionStorage.setItem("theme", dark);
  };
  return (
    <DarkThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </DarkThemeContext.Provider>
  );
};

export default DarkThemeState;
