import { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useGetAllTodoItemsMutation } from "../../redux/todo/todoApi";
import {
  formatDateToYYYYMMDD,
  formatDateToYYYYMMDDTHHMM,
} from "../../utils/isoDateConversion";
import CustomModal from "../CustomModal/CustomModal";
import EventCard from "../EventCard/EventCard";
import EventContext from "../../Context/Event/EventContext";
import { compareIst } from "../../utils/compareIst";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [todos, setTodos] = useState([]);
  const calendarEvent = useContext(EventContext);
  const { selectedEvent, setSelectedEvent } = calendarEvent;
  const [showTodo, setShowTodo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  //  const [selectedEvent, setSelectedEvent] = useState(null);
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
      setPopupPosition({ top: clientY-200 , left: clientX + 200 });
    } else if (clientY >= 420 ) {
      setPopupPosition({ top: clientY - 200, left: clientX  });
    }else if (clientX >= 1023) {
      setPopupPosition({ top: clientY + 100, left: clientX - 200 });
    } else if (clientX <= 341) {
      setPopupPosition({ top: clientY , left: clientX + 200 });
    } else if (clientY >= 420) {
      setPopupPosition({ top: clientY - 200, left: clientX  });
    } else {
      setPopupPosition({ top: clientY + 100, left: clientX + 200 });
    }
    setShowTodo((prevState) => {
      if (JSON.stringify(prevState.start) === JSON.stringify(start)) {
        setIsOpen(!isOpen);
      } else {
        setIsOpen(!isOpen);
      }
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
        start: moment(new Date(item?.dateTime).toString()).toDate(),
        end: moment(new Date(item?.dateTime).toString()).toDate(),
        title: item.title,
        id: item._id,
        category: item.category,
      };
      const { date1IST, date2IST } = compareIst(
        new Date(event.start),
        new Date()
      );

      if (date1IST < date2IST) {
        event.customProp = "important";
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
    if (event.customProp === "important") {
      return {
        className: "important-event",
        style: {
          backgroundColor: "red",
        },
      };
    } else {
      return {
        className: "normal-event",
      };
    }
  };

  return (
    <>
      <div className=" relative w-2/3 mt-3">
        <div className="absolute w-[1218px] h-[100vh]  ">
          <Calendar
            localizer={localizer}
            events={todos}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSlot}
            selectable
            onSelectEvent={handleCalendarEvent}
            eventPropGetter={eventStyleGetter}
          />
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
