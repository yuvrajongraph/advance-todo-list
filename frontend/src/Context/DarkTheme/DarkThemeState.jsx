import DarkThemeContext from "./DarkThemeContext";

import { useState } from "react";

const DarkThemeState = ({ children }) => {
  // save the dark theme is true or false in local storage also to maintain the same theme even after reloading
  if (JSON.parse(sessionStorage.getItem("theme")) == null) {
    sessionStorage.setItem("theme", false);
  }
  // declare a state variable to store the dark theme is true or not
  const [dark, setDark] = useState(JSON.parse(sessionStorage.getItem("theme")));
  sessionStorage.setItem("theme", dark);

  // function to handle the theme of app i.e. light or dark
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
