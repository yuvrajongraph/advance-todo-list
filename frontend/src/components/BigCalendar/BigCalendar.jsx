import { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {  useGetAllTodoItemsQuery } from "../../redux/todo/todoApi";
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

const localizer = momentLocalizer(moment);
let c = 0, d=0;

const BigCalendar = () => {
  const [todos, setTodos] = useState([]);
  const calendarEvent = useContext(EventContext);
  const { selectedEvent, setSelectedEvent } = calendarEvent;
  const {dark, toggleTheme} = useContext(DarkThemeContext);
  const [showTodo, setShowTodo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [checkReload, setCheckReload] = useState(0);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const getAllTodoItems = useGetAllTodoItemsQuery();    

  const todoSchema = {
    title: "",
    status: "",
    category: "",
    dateTime: "",
    description: "",
  };

  const events = [];
  const [input, setInput] = useState({
    title: "",
    category: "",
    dateTime: "",
  });

  const calculatePopupPosition = (clientX, clientY) =>{
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
  }


  const handleSlot = ({ start, end, box }) => {
    setIsEventOpen(false);
    const { clientX, clientY } = box;
    calculatePopupPosition(clientX,clientY);
   
    setShowTodo(() => {
      setIsOpen(!isOpen);
      return { start, end };
    });

    const dateTime = formatDateToYYYYMMDDTHHMM(new Date(start));
    input.dateTime = dateTime;
  };

  const handleCalendarEvent = (event, e) => {
    const { clientX, clientY } = e;
    calculatePopupPosition(clientX,clientY);
    setIsOpen(false);
    setSelectedEvent(() => {
      return event;
    });

    setIsEventOpen(!isEventOpen);
  };

  const getTodoEvents = async () => {

    const response = await getAllTodoItems.refetch();
    const eventArray = response?.data?.data?.map((item) => {
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

      if (date1IST >= date2IST && date1IST <= newDate) {
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

    events.push(eventArray);
    setTodos(events[0]);
  };

  useEffect(() => {
    getTodoEvents();
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
   .rbc-day-bg {
    background-color: #282828;
    color: white;
  }
  .rbc-button-link{
    color:white;
  }
  .rbc-header{
    background-color: #282828;
    color: white;
  }
  .rbc-time-slot{
    background-color: #282828;
    color: white;
  }
  .rbc-label{
    background-color: #282828;
   color:red
  }
  .rbc-header span{

    color: red;
  }
  .rbc-toolbar {
    background-color: #282828;
    color: red;
  }
  .rbc-toolbar button{
    
    color: red;
  }
   .rbc-event {
    background-color: #3174ad;;
  }
`;

  return (
    <>
      <div className=" relative w-2/3 mt-3 z-10">
        <div className="fixed top-[80px] w-[1526px] ml-[-155px] h-[630px]"   >
          {dark ? <StyledCalendar
            localizer={localizer}
            events={todos}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSlot}
            selectable
            onSelectEvent={handleCalendarEvent}
            views={['month', 'week', 'day']}
            eventPropGetter={eventStyleGetter}
          />: <Calendar
          localizer={localizer}
          events={todos}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSlot}
          selectable
          onSelectEvent={handleCalendarEvent}
          views={['month', 'week', 'day']}
          eventPropGetter={eventStyleGetter}
        />}
          
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
