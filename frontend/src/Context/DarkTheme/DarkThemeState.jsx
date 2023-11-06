import DarkThemeContext from "./DarkThemeContext";

import { useState } from "react";

const DarkThemeState = ({children})=>{
    const [dark, setDark] = useState(false);

    const toggleTheme = ()=>{
        setDark(!dark);
    }
    return (
        <DarkThemeContext.Provider value={{dark,toggleTheme}}>
            {children}
        </DarkThemeContext.Provider>
    )
}

export default DarkThemeState;
