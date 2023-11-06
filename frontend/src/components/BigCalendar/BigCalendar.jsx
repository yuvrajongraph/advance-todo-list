import { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useGetAllTodoItemsMutation } from "../../redux/todo/todoApi";
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
  const [getAllTodoItems] = useGetAllTodoItemsMutation();

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

  const handleSlot = ({ start, end, box }) => {
    setIsEventOpen(false);
    const { clientX, clientY } = box;
    console.log(clientX, "=====", clientY);
    if (clientY >= 259 && clientX >= 1023) {
      setPopupPosition({ top: clientY - 200, left: clientX - 200 });
    } else if (clientX <= 341 && clientY >= 420) {
      setPopupPosition({ top: clientY - 200, left: clientX + 200 });
    } else if (clientY >= 420) {
      setPopupPosition({ top: clientY - 200, left: clientX });
    } else if (clientX >= 1023) {
      setPopupPosition({ top: clientY + 100, left: clientX - 200 });
    } else if (clientX <= 341) {
      setPopupPosition({ top: clientY, left: clientX + 200 });
    } else if (clientY >= 420) {
      setPopupPosition({ top: clientY - 200, left: clientX });
    } else {
      setPopupPosition({ top: clientY + 100, left: clientX + 200 });
    }

    setShowTodo(() => {
      setIsOpen(!isOpen);
      return { start, end };
    });

    const dateTime = formatDateToYYYYMMDDTHHMM(new Date(start));
    input.dateTime = dateTime;
  };

  const handleCalendarEvent = (event, e) => {
    const { clientX, clientY } = e;
    setPopupPosition({ top: clientY + 25, left: clientX + 250 });
    setIsOpen(false);
    setSelectedEvent(() => {
      return event;
    });

    setIsEventOpen(!isEventOpen);
  };

  const getTodoEvents = async () => {
    const response = await getAllTodoItems(todoSchema);
    const eventArray = response?.data?.data.map((item) => {
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
      if (d === 0) {
        const timeDiff =
          new Date(date1IST).getTime() - moment(new Date()).toDate().getTime();
        // console.log(timeDiff);

        if (timeDiff > 0) {
          setTimeout(function () {
            window.location.reload();
          }, timeDiff);
        }
      }

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
        <div className="absolute top-[80px] w-[1526px] ml-[-155px] h-[630px]" style={{position:"fixed" }}  >
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
        />
        {selectedEvent && (
          <EventCard
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            popupPosition={popupPosition}
            isEventOpen={isEventOpen}
            setIsEventOpen={setIsEventOpen}
          />
        )}
      </div>
    </>
  );
};

export default BigCalendar;
