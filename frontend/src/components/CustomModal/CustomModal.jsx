import React, { useContext, useState } from "react";
import { useCreateTodoItemMutation } from "../../redux/todo/todoApi";
import { useCreateAppointmentMutation } from "../../redux/appointment/appointmentApi";
import { useGoogleCalendarMutation } from "../../redux/auth/authApi";
import { toast } from "react-toastify";
import ModalNavbar from "./ModalNavbar";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { formatDateToYYYYMMDDTHHMM } from "../../utils/dateConversion";
import CalendarContext from "../../Context/Calendar/CalendarContext";
import { useDispatch } from "react-redux";
import "./CustomModal.css";
import { addTodoItem } from "../../redux/todo/todoSlice";


const CustomModal = ({
  showTodo,
  isOpen,
  input,
  setInput,
  setIsOpen,
  popupPosition,
  setPopupPosition,
}) => {
  // const [modalIsOpen, setModalIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("normal");
  const options = ["normal", "food", "other"];
  const [activeLink, setActiveLink] = useState("todo");
  //const {map, setMap} = useContext(CalendarContext);
  const { title, category, dateTime, description,startTime,endTime } = input;
  // const [selectedEvent, setSelectedEvent] = useState(null);
  const dispatch = useDispatch();

  const [createTodoItem] = useCreateTodoItemMutation();
  const [createAppointment]= useCreateAppointmentMutation();
  const [googleCalendar] = useGoogleCalendarMutation();

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(selectedOption);
  };

  const handleInputEvent = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setInput(() => {
      return { ...input, [name]: value };
    });
  };

  const handleDateTime = (e) => {
  
    setInput(() => {
      return { ...input, dateTime: e.$d };
    });
  };
  const handleStartTime = (e) => {
    
    setInput(() => {
      return { ...input, startTime: e.$d};
    });
  };
  const handleEndTime = (e) => {
    
    setInput(() => {
      return { ...input, endTime: e.$d};
    });
  };

  const saveTodo = async (e) => {
    e.preventDefault();
    const response = activeLink === 'todo' ? await createTodoItem({
      title,
      status: "open",
      category: selectedOption,
      dateTime: dateTime,
    }): await createAppointment({
      title,
      status: "open",
      startTime: startTime,
      endTime: endTime
    }) ;

    if (response.data) {
      const start = activeLink === 'todo' ? dateTime : startTime;
      const end = activeLink === 'todo' ? dateTime : endTime;
      const calendarResponse = await googleCalendar({title,startTime: start,endTime: end});
      if(calendarResponse.data){
        toast.success(calendarResponse?.data?.message);
      }else{
        toast.error(calendarResponse?.error?.data?.error);
      }
      dispatch(addTodoItem(response?.data?.data))
      toast.success(response?.data?.message);
      const eventId =  response?.data?.data?._id
      const googleCalendarId = calendarResponse?.data?.data?.id
      if(JSON.parse(localStorage.getItem("map")) === null){
        const intialMap = new Map();
        intialMap.set(eventId,googleCalendarId);
        localStorage.setItem("map", JSON.stringify(Array.from(intialMap)));
      }else{
        const map = JSON.parse(localStorage.getItem("map"));
        const newMap = new Map(map);
        newMap.set(eventId,googleCalendarId)
        localStorage.setItem("map", JSON.stringify(Array.from(newMap)));
      }
  } else {
      toast.error(response?.error?.data?.error);
    }
    setInput({
      title: "",
      category: "",
      dateTime: "",
      description: "",
      startTime:"",
      endTime:""
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  //   const closeModal = () => {
  //     setIsOpen(false);
  //   };

  return (
    <>
      {/* {isOpen && (
        
      )} */}
      {isOpen && (
        <>
          <div
            className=" fixed transform -translate-x-1/2 -translate-y-1/2  w-1/5 mt-3"
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            <div className="bg-[#E6E6E6] p-4 rounded shadow">
              <div className="mb-4 ">
                <label
                  className="block text-gray-600 text-sm font-semibold mb-2"
                  htmlFor="Title"
                >
                  Title
                </label>
                <input
                  className="border-b border-black focus:outline-none focus:border-[blue] bg-[#E6E6E6]"
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleInputEvent}
                />
              </div>
              <ModalNavbar
                activeLink={activeLink}
                setActiveLink={setActiveLink}
              />
              <form>
                {activeLink === "todo" ? (
                  <>
                    <div className="mb-4 ">
                      <label
                        className="block text-gray-600 text-sm font-semibold mb-2"
                        htmlFor="Category"
                      >
                        Category
                      </label>
                      <select
                        value={selectedOption}
                        onChange={handleOptionChange}
                        className="mt-2 p-2 w-full border rounded shadow-sm"
                      >
                        {options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            label="Date Time"
                            value={dayjs(dateTime)}
                            onChange={handleDateTime}
                            format="YYYY-MM-DDThh:mm"
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                    <div className="mb-4 ">
                      <label
                        className="block text-gray-600 text-sm font-semibold mb-2"
                        htmlFor="Description"
                      >
                        Description
                      </label>
                      <input
                        className="description w-full border p-2 rounded"
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Add description"
                        value={description}
                        onChange={handleInputEvent}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            label="Start Time"
                            value={dayjs(startTime)}
                            onChange={handleStartTime}
                            format="YYYY-MM-DDThh:mm"
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                    <div className="mb-4 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            label="End Time"
                            value={dayjs(endTime)}
                            onChange={handleEndTime}
                            format="YYYY-MM-DDThh:mm"
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                    <div className="mb-4 ">
                      <label
                        className="block text-gray-600 text-sm font-semibold mb-2"
                        htmlFor="Description"
                      >
                        Description
                      </label>
                      <input
                        className="description w-full border p-2 rounded"
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Add description"
                        value={description}
                        onChange={handleInputEvent}
                      />
                    </div>
                  </>
                )}
                <div className="mb-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    type="submit"
                    onClick={saveTodo}
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CustomModal;
