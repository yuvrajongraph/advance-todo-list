import CalendarContext from "./CalendarContext";

import { useState } from "react";

const CalendarState = ({children})=>{
    const [map, setMap] = useState('');
    return (
        <CalendarContext.Provider value={{map,setMap}}>
            {children}
        </CalendarContext.Provider>
    )
}

export default CalendarState;