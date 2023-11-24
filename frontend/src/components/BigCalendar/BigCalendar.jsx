import { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useGetAllTodoItemsMutation } from "../../redux/todo/todoApi";
import {  useGetAllAppointmentsQuery } from "../../redux/appointment/appointmentApi";
import {
  formatDateToYYYYMMDD,
  formatDateToYYYYMMDDTHHMM,
} from "../../utils/dateConversion";
import CustomModal from "../CustomModal/CustomModal";
import EventCard from "../EventCard/EventCard";
import EventContext from "../../Context/Event/EventContext";
import { compareIst } from "../../utils/compareIst";
import { styled } from "@mui/material";
import DarkThemeContext from "../../Context/DarkTheme/DarkThemeContext";
import { toast } from "react-toastify";
const timeArray = [];
const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [events, setEvents] = useState([]);
  const calendarEvent = useContext(EventContext);
  const { selectedEvent, setSelectedEvent } = calendarEvent;
  const { dark, toggleTheme } = useContext(DarkThemeContext);
  const [showTodo, setShowTodo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [checkReload, setCheckReload] = useState(0);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [getAllTodoItems] =useGetAllTodoItemsMutation();
  const getAllAppointments = useGetAllAppointmentsQuery();

  const todoSchema = {
    title: "",
    status: "",
    category: "",
    dateTime: "",
    description: "",
  };

  const todos = [];
  const appointments = [];
  const [input, setInput] = useState({
    title: "",
    category: "",
    dateTime: "",
    description:"",
    startTime:"",
    endTime:""
  });

  const calculatePopupPosition = (clientX, clientY) => {
    const offset = 200;
    const screenLimitX = window.innerWidth - offset;
    const screenLimitY = window.innerHeight - offset;

    let top = clientY;
    let left = clientX;

    if (clientY >= screenLimitY) {
      top -= offset;
    }

    if (clientX >= screenLimitX) {
      left -= offset;
    }

    setPopupPosition({ top, left });
  };

  const handleSlot = ({ start, end, box }) => {
    setIsEventOpen(false);
    const { clientX, clientY } = box;
    calculatePopupPosition(clientX, clientY);

    setShowTodo(() => {
      setIsOpen(!isOpen);
      return { start, end };
    });
  
    const dateTime = formatDateToYYYYMMDDTHHMM(new Date(start));
    const startTime = formatDateToYYYYMMDDTHHMM(new Date(start));
    const endTime = formatDateToYYYYMMDDTHHMM(new Date(end));
    input.dateTime = dateTime;
    input.startTime = startTime;
    input.endTime = endTime;
  };

  const handleCalendarEvent = (event, e) => {
    const { clientX, clientY } = e;
    calculatePopupPosition(clientX, clientY);
    setIsOpen(false);
    setSelectedEvent(() => {
      return event;
    });
    

    setIsEventOpen(!isEventOpen);
  };

  const getTodoEvents = async () => {
    const response = await getAllTodoItems();
    
    const eventArray =  response?.data?.data?.map((item) => {
      const event = {
        start: moment(new Date(item?.dateTime)).toDate(),
        end: moment(new Date(item?.dateTime)).toDate(),
        title: item.title,
        id: item._id,
        category: item.category,
      }; 
      const { date1IST, date2IST } = compareIst(
        new Date(event.start),
        new Date()
      );

      const originalDate = new Date(date2IST);
      const newDate = new Date(originalDate.getTime() + 1 * 60 * 1000);
      //timeArray.push(date1IST);

      if (date1IST >= date2IST && date1IST <= newDate) {
        toast.success("alarm for reminder");
        event.customProp = "important";
        setTimeout(() => {
          window.location.reload();
        }, 60000);
      } else if (date1IST < newDate) {
        event.customProp = "complete";
      } else {
        event.customProp = "normal";
      }
      return event;
    });
  
    
    todos.push(eventArray);
  };
  
  const getAppointmentEvents = async () => {
    const response = await getAllAppointments.refetch();
    const eventArray = response?.data?.data?.map((item) => {
      const event = {
        start: moment(new Date(item?.startTime)).toDate(),
        end: moment(new Date(item?.endTime)).toDate(),
        title: item.title,
        id: item._id,
      }; 
      const { date1IST, date2IST } = compareIst(
        new Date(event.start),
        new Date()
      );

      const originalDate = new Date(date2IST);
      const newDate = new Date(new Date(
        event.end.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      ));
     // timeArray.push(date1IST);

      if (date1IST <= date2IST && date2IST < newDate) {
        toast.success("alarm for reminder");
        event.customProp = "important";
        setTimeout(() => {
          window.location.reload();
        }, 60000);
      } else if (date2IST >= newDate) {
        event.customProp = "complete";
      } else {
        event.customProp = "normal";
      }
      return event;
    });
    appointments.push(eventArray);
    //console.log(appointments[0],"====",todos[0]);
    setEvents(()=>{
      return todos[0].concat(appointments[0])
    });
  }; 


  // (function () {
  //   const now = new Date();
  //   const currentTimestamp = now.getTime();
  //   for (let i = 0; i < timeArray.length; i++) {
  //     const targetTimestamp = timeArray[i].getTime();
  //     const delay = targetTimestamp - currentTimestamp;
  //     if(delay > 0){
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, delay);
  //   }
  //   }
  // })();

  useEffect(() => {
    getTodoEvents();
    getAppointmentEvents();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    if (event.customProp === "complete") {
      return {
        className: "complete-event",
        style: {
          backgroundColor: "#E13E3E",
          textDecoration: "line-through",
        },
      };
    } else if (event.customProp === "important") {
      return {
        className: "important-event",
        style: {
          backgroundColor: "#F2F239",
          animation: "shake 0.5s",
          animationIterationCount: "infinite",
        },
      };
    } else {
      return {
        className: "normal-event",
      };
    }
  };

  const StyledCalendar = styled(Calendar)`
    .rbc-day-bg,
    .rbc-time-slot,
    .rbc-header {
      background-color: #282828;
      color: white;
    }
    .rbc-button-link {
      color: white;
    }
    .rbc-label {
      background-color: #282828;
      color: red;
    }
    .rbc-header span {
      color: red;
    }
    .rbc-toolbar {
      background-color: #282828;
      color: red;
    }
    .rbc-toolbar button {
      color: red;
    }
    .rbc-event {
      background-color: #3174ad;
    }
  `;

  return (
    <>
      <div className=" relative w-2/3 mt-3 z-10">
        <div className="fixed top-[80px] w-[1526px] ml-[-155px] h-[630px]">
          {dark ? (
            <StyledCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSlot}
              selectable
              onSelectEvent={handleCalendarEvent}
              views={["month", "week", "day"]}
              eventPropGetter={eventStyleGetter}
            />
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSlot}
              selectable
              onSelectEvent={handleCalendarEvent}
              views={["month", "week", "day"]}
              eventPropGetter={eventStyleGetter}
            />
          )}
        </div>
        <CustomModal
          showTodo={showTodo}
          isOpen={isOpen}
          input={input}
          setInput={setInput}
          handleSlot={handleSlot}
          setIsOpen={setIsOpen}
          popupPosition={popupPosition}
          setPopupPosition={setPopupPosition}
        />
        {selectedEvent && (
          <EventCard
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            popupPosition={popupPosition}
            setPopupPosition={setPopupPosition}
            isEventOpen={isEventOpen}
            setIsEventOpen={setIsEventOpen}
          />
        )}
      </div>
    </>
  );
};

export default BigCalendar;
