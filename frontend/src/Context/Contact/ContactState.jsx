import ContactContext from "./ContactContext";

import { useState } from "react";

const ContactState = ({children})=>{
    // declare a state variable to store the contact name
    const [contactName, setContactName] = useState('');
    return (
        <ContactContext.Provider value={{contactName, setContactName}}>
            {children}
        </ContactContext.Provider>
    )
}

export default ContactState;
