import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SquareIcon from "@mui/icons-material/Square";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import DeletePopUpScreen from "./DeletePopUpScreen";
import { useNavigate } from "react-router-dom";
import { compareIst } from "../../utils/compareIst";


const EventCard = ({
  selectedEvent,
  setSelectedEvent,
  popupPosition,
  isEventOpen,
  setIsEventOpen,
}) => {
  const navigate = useNavigate();
  const istDateTimeDisplay = new Date(selectedEvent.start)
    .toDateString()
    .split(" ");
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [cutThrough, setCutThrough] = useState(false);
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
    navigate("/update");
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
            className="transform -translate-x-1/2 -translate-y-1/2 z-50 w-1/5 mt-3 "
            style={{
              position: "fixed",
              top: popupPosition.top,
              left: popupPosition.left,
            }}
          >
            <div
              className="bg-[#E6E6E6] p-4 rounded shadow flex flex-col whitespace-nowrap"
              style={{ resize: "horizontal", overflow: "auto" }}
            >
              <div className="flex flex-wrap justify-end">
                <button onClick={deleteEvent}>
                  <DeleteIcon
                    fontSize="small"
                    style={{ margin: "0px 10px" }}
                    className="hover:text-red-500"
                  />
                </button>
                <button onClick={updateEvent}>
                  <ModeEditIcon
                    fontSize="small"
                    style={{ margin: "0px 10px" }}
                    className="hover:text-red-500"
                  />
                </button>
                <MoreHorizIcon
                  fontSize="small"
                  style={{ margin: "0px 10px" }}
                  className="hover:text-red-500"
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
                  className="text-lg pl-1"
                  style={{
                    textDecoration: cutThrough ? "line-through" : "none",
                  }}
                >
                  {selectedEvent.title}
                </h1>
              </div>
              <div className="mt-[-20px] mr-[85px]">
                <h2
                  className="text-md"
                  style={{
                    textDecoration: cutThrough ? "line-through" : "none",
                  }}
                >{`${istDateTimeDisplay[0]}, ${istDateTimeDisplay[1]} ${istDateTimeDisplay[2]}`}</h2>
              </div>
            </div>
          </div>
        </>
      )}
      {deletePopUp && (
        <DeletePopUpScreen
          deletePopUp={deletePopUp}
          setDeletePopUp={setDeletePopUp}
          popupPosition={popupPosition}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      )}
    </>
  );
};

export default EventCard;
