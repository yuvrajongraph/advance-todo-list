import { useEffect, useState, useContext } from "react";
import { useGoogleContactMutation } from "../../redux/auth/authApi";
import { useNavigate } from "react-router-dom";
import ContactContext from "../../Context/Contact/ContactContext";
import DarkThemeContext from "../../Context/DarkTheme/DarkThemeContext";

const GoogleContact = () => {
  const [googleContact] = useGoogleContactMutation();
  const [contactList, setContactList] = useState([]);
  const navigate = useNavigate();
  const { contactName, setContactName } = useContext(ContactContext);
  const { dark, toggleTheme } = useContext(DarkThemeContext);
  const dynamicClass = dark?  `bg-[#282828] text-white`:''

  // fetch the google contact api to fetch the list of contact
  const getContacts = async () => {
    const response = await googleContact();
    setContactList(response.data.data);
  };

  // set the state variable in Contact Context to a specific contact name from the list
  const handleContact = (contact) => {
    setContactName(contact);
    navigate("/");
  };
  useEffect(() => {
    getContacts();
  }, []);
  return (
    <>
      <div className={`w-[1530px] ml-[-159px] mt-12 ${dynamicClass} overflow-y-auto overflow-x-hidden`}>
        <ul>
          {contactList.map((contact,index) => (
            <button
              onClick={() => handleContact(contact)}
              name="contact"
              className="border-b-2 border-gray-300 hover:border-blue-500 py-2 px-4 w-full  text-sm"
              key={index}
            >
              <li>{contact}</li>
            </button>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GoogleContact;
