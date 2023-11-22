import React, { useState, useEffect, useContext } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SquareIcon from "@mui/icons-material/Square";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import DeletePopUpScreen from "./DeletePopUpScreen";
import { useNavigate } from "react-router-dom";
import { compareIst } from "../../utils/compareIst";
import "./EventCard.css"

const EventCard = ({
  selectedEvent,
  setSelectedEvent,
  popupPosition,
  setPopupPosition,
  isEventOpen,
  setIsEventOpen,
}) => {
  const navigate = useNavigate();
  const istDateTimeDisplay = new Date(selectedEvent.start)
    .toDateString()
    .split(" ");
    const istStartTimeDisplay = new Date(selectedEvent.start)
    .toDateString()
    .split(" ");
    const istEndTimeDisplay = new Date(selectedEvent.end)
    .toDateString()
    .split(" ");
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [cutThrough, setCutThrough] = useState(false);
  const dynamicClass = cutThrough ? 'line-through':''
  const eventTypeClass = selectedEvent.category ? '':'m-[4px] ml-[52px]'
  const closePopUp = () => {
    setIsEventOpen(false);
  };

  const deleteEvent = (e) => {
    e.preventDefault();
    setIsEventOpen(false);
    setDeletePopUp(true);
  };

  const updateEvent = (e) => {
    e.preventDefault();
    setIsEventOpen(false);
    const type = selectedEvent.category ? 'todo':'appointment';
    navigate(`/update/${type}`);
  };

  useEffect(() => {
    const { date1IST, date2IST } = compareIst(
      new Date(selectedEvent.start),
      new Date()
    );

    if (date1IST < date2IST) {
      setCutThrough(true);
    } else {
      setCutThrough(false);
    }
  }, [selectedEvent]);
  return (
    <>
      {isEventOpen && (
        <>
          <div
            className="fixed transform -translate-x-1/2 -translate-y-1/2  w-1/5 mt-3 "
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            <div
              className="bg-[#E6E6E6] p-4 rounded shadow flex flex-col whitespace-nowrap event-popup"
            >
              <div className="flex flex-wrap justify-end">
                <button onClick={deleteEvent}>
                  <DeleteIcon
                    fontSize="small"
                    className="hover:text-red-500 event-delete-icon"
                  />
                </button>
                <button onClick={updateEvent}>
                  <ModeEditIcon
                    fontSize="small"
                    className="hover:text-red-500 event-update-icon"
                  />
                </button>
                <MoreHorizIcon
                  fontSize="small"
                  className="hover:text-red-500 event-more-options-icon"
                />
                <button onClick={closePopUp}>
                  <CloseIcon fontSize="small" className="hover:text-red-500" />
                </button>
              </div>
              <div className="p-3 flex">
                <SquareIcon
                  fontSize="large"
                  color="primary"
                  className="hover:text-green-500"
                />

                <h1
                  className={`text-lg pl-1 ${dynamicClass}`}
                >
                  {selectedEvent.title}
                </h1>
              </div>
              <div className="mt-[-20px] mr-[85px]">
                <h2
                  className={`text-md ${dynamicClass} ${eventTypeClass}`}
                >{!selectedEvent.category ? `${istStartTimeDisplay[0]}, ${istStartTimeDisplay[1]} ${istStartTimeDisplay[2]} - ${istEndTimeDisplay[0]}, ${istEndTimeDisplay[1]} ${istEndTimeDisplay[2]}`:`${istDateTimeDisplay[0]}, ${istDateTimeDisplay[1]} ${istDateTimeDisplay[2]}`}</h2>
              </div>
            </div>
          </div>
        </>
      )}
      
        <DeletePopUpScreen
          deletePopUp={deletePopUp}
          setDeletePopUp={setDeletePopUp}
          popupPosition={popupPosition}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
    
    </>
  );
};

export default EventCard;
