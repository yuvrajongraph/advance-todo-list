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
import ContactContext from "../../Context/Contact/ContactContext";
const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
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
  const {contactName, setContactName} = useContext(ContactContext);
  const contactTitle = contactName !== ''? `${contactName}'s birthday`:'';
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
    title: contactTitle,
    category: "",
    dateTime: "",
    description:"",
    startTime:"",
    endTime:""
  });

  // for calculating where the pop up appears on the calendar
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

  // functionality for handling the empty slot on calendar
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

  // when a user click on a event that have been already made on the calendar
  const handleCalendarEvent = (event, e) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    calculatePopupPosition(clientX, clientY);
    setIsOpen(false);
    setSelectedEvent(() => {
      return event;
    });
    

    setIsEventOpen(!isEventOpen);
  };

 // for getting all the todo events on the calendar when intial renders
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

      const originalDate = new Date(date1IST);
      const newDate = new Date(originalDate.getTime() + 2 * 60 * 1000);
        const diffTime = newDate-date2IST > 0 ? newDate-date2IST: 0;
      if (date1IST <= date2IST && date2IST < newDate) {
        toast.success("alarm for reminder");
        event.customProp = "important";
        setTimeout(() => {
          window.location.reload();
        }, diffTime);
      } else if (date2IST >= newDate) {
        event.customProp = "complete";
      } else {
        event.customProp = "normal";
      }
      return event;
    });
  
    
    todos.push(eventArray);
  };
  
  // for getting all the appointment events on the calendar when intial renders
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
      if (date1IST <= date2IST && date2IST < newDate) {
        toast.success("alarm for reminder");
        event.customProp = "important";
        const diffTime = newDate-date2IST > 0 ? newDate-date2IST: 0;
        setTimeout(() => {
          window.location.reload();
        }, diffTime);
      } else if (date2IST >= newDate) {
        event.customProp = "complete";
      } else {
        event.customProp = "normal";
      }
      return event;
    });
    appointments.push(eventArray);
    setEvents(()=>{
      return todos[0].concat(appointments[0])
    });
  }; 

  useEffect(() => {
    getTodoEvents();
    getAppointmentEvents();
  }, []);
  
  const eventStyleGetter = (event, start, end, isSelected) => {

    // for conditional functioning of the calendar when the time matched (alarming the events) and time got expire
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

  // style the calendar in dark mode
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
  
  // to prevent the default navigation to the today page of calendar whenever click to event and empty slot of calendar
  const handleNavigate = (newDate, view, action) => {
    setDate(newDate);
}

  return (
    <>
      <div className=" relative w-2/3 mt-3 z-10">
        <div className="fixed top-[80px] w-[1526px] ml-[-155px] h-[630px]">
          {dark ? (
            <StyledCalendar
              localizer={localizer}
              events={events}
              date={date}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSlot}
              selectable
              onSelectEvent={handleCalendarEvent}
              views={["month", "week", "day"]}
              eventPropGetter={eventStyleGetter}
              onNavigate={handleNavigate}
            />
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              date={date}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSlot}
              selectable
              onSelectEvent={handleCalendarEvent}
              views={["month", "week", "day"]}
              eventPropGetter={eventStyleGetter}
              onNavigate={handleNavigate}
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
