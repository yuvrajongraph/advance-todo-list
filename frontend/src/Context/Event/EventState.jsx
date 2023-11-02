import EventContext from "./EventContext";

import { useState } from "react";

const EventState = ({children})=>{
    const [selectedEvent, setSelectedEvent] = useState(null);
    return (
        <EventContext.Provider value={{selectedEvent,setSelectedEvent}}>
            {children}
        </EventContext.Provider>
    )
}

export default EventState;
