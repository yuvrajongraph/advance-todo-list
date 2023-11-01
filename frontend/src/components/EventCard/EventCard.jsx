import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

const EventCard = ({
  selectedEvent,
  setSelectedItem,
  popupPosition,
  isEventOpen,
}) => {
  return (
    <>
      {isEventOpen && (
        <>
          <div
            className="transform -translate-x-1/2 -translate-y-1/2 z-50 w-1/5 mt-3"
            style={{
              position: "fixed",
              top: popupPosition.top,
              left: popupPosition.left,
            }}
          >
            <div className="bg-[#E6E6E6] p-4 rounded shadow ">
              <h1>{selectedEvent.title}</h1>
              <Button>
                Secondary
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EventCard;
