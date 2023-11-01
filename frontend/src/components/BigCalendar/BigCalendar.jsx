import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useGetAllTodoItemsMutation } from "../../redux/todo/todoApi";
import { formatDateToYYYYMMDD } from "../../utils/isoDateConversion";
import CustomModal from "../CustomModal/CustomModal";
import EventCard from "../EventCard/EventCard";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [todos, setTodos] = useState([]);

  const [showTodo, setShowTodo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
   const [selectedEvent, setSelectedEvent] = useState(null);
  const [getAllTodoItems] = useGetAllTodoItemsMutation();
 
  const todoSchema = {
    title: "",
    status: "",
    category: "",
    dateTime: "",
    description: ""
  };

  const events = [];
  const [input, setInput] = useState({
    title: "",
    category: "",
    dateTime: "",
  });

  const handleSlot = ({start,end,box}) => {
    setIsEventOpen(false);
    const {clientX, clientY,x,y} = box;
    console.log(clientX,"=====",clientY);
    if(clientY>=259 && clientX >=1023){
      setPopupPosition({ top: clientY-200, left: clientX - 200 });
    }else if(clientX >=1023){
      setPopupPosition({ top: clientY+100, left: clientX - 200 });
    }else if(clientY>=259){
      setPopupPosition({ top: clientY-200, left: clientX - 200 });
    }else {
    setPopupPosition({ top: clientY+100, left: clientX + 200 });
    }
    setShowTodo((prevState) => {
      if(JSON.stringify(prevState.start) === JSON.stringify(start)){
        setIsOpen(!isOpen);
      }else{
        setIsOpen(!isOpen);
      }
      return {start, end}
    });
    const dateTime = formatDateToYYYYMMDD(new Date(start));
    input.dateTime = dateTime;
  };

  const handleCalendarEvent = (event,e)=>{

   const {clientX, clientY} = e;
   setPopupPosition({top: clientY+25, left:clientX+250})
    setIsOpen(false)
    setSelectedEvent(() => { 
      return event
    });
    setIsEventOpen(!isEventOpen);
  }

  const getTodoEvents = async () => {
    const response = await getAllTodoItems(todoSchema);
    const eventArray = response?.data?.data.map((item) => {
      const event = {
        start: moment(new Date(item?.dateTime).toString()).toDate(),
        end: moment(new Date(item?.dateTime).toString()).toDate(),
        title: item.title,
      };
      return event;
    });

    events.push(eventArray);
    setTodos(events[0]);
  };

  useEffect(() => {
    getTodoEvents();
  }, []);

  return (
    <>
      <div className=" relative w-2/3 mt-3">
        <div className="absolute w-[1218px] h-[100vh]  ">
        <Calendar
          localizer={localizer}
          events={todos}
          startAccessor="start"
          endAccessor="end"
          // style={{  zIndex: 99 }}
          onSelectSlot={handleSlot}
          selectable
          onSelectEvent={handleCalendarEvent}
        />
        </div>
        <CustomModal showTodo={showTodo} isOpen={isOpen} input={input} setInput={setInput} handleSlot={handleSlot} setIsOpen={setIsOpen} popupPosition = {popupPosition} />
        { selectedEvent && (<EventCard selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} popupPosition={popupPosition} isEventOpen= {isEventOpen}/>)}
      </div>
    </>
  );
};

export default BigCalendar;
