import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {
  formatDateToYYYYMMDDTHHMM,
  formatDateToYYYYMMDD,
} from "../../utils/dateConversion";
import EventContext from "../../Context/Event/EventContext";
import { useUpdateTodoItemMutation } from "../../redux/todo/todoApi";
import { useUpdateAppointmentMutation } from "../../redux/appointment/appointmentApi";
import { useUpdateGoogleCalendarEventMutation } from "../../redux/auth/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import DarkThemeContext from "../../Context/DarkTheme/DarkThemeContext";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./UpdateEventScreen.css";
import { updateSingleTodoItem } from "../../redux/todo/todoSlice";

const UpdateEventScreen = () => {
  const calendarEvent = useContext(EventContext);
  const { type } = useParams();
  const { selectedEvent, setSelectedEvent } = calendarEvent;
  const options = ["normal", "food", "other"];
  const [updateTodoItem] = useUpdateTodoItemMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [updateGoogleCalendarEvent] = useUpdateGoogleCalendarEventMutation();
  const { dark, toggleTheme } = useContext(DarkThemeContext);
  const [selectedOption, setSelectedOption] = useState(selectedEvent.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    title: selectedEvent.title,
    category: selectedEvent.category,
    dateTime: formatDateToYYYYMMDDTHHMM(new Date(selectedEvent.start)),
    startTime: formatDateToYYYYMMDDTHHMM(new Date(selectedEvent.start)),
    endTime: formatDateToYYYYMMDDTHHMM(new Date(selectedEvent.end)),
  });
  const styleTextField = dark
    ? {
        "label.Mui-focused": {
          color: "blue",
        },
        label: {
          color: "red",
        },
        ".MuiInputBase-input": {
          color: "white",
          backgroundColor: "black",
        },
        ".MuiButtonBase-root": {
          color: "white",
          backgroundColor: "black",
        },
      }
    : {};
  const dynamicClass = dark ? "bg-[#282828] text-white" : "";
  const { title, category } = input;
  const handleInputEvent = (e) => {
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
      return { ...input, startTime: e.$d };
    });
  };
  const handleEndTime = (e) => {
    setInput(() => {
      return { ...input, endTime: e.$d };
    });
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const confirmUpdateEvent = async (e) => {
    const response = selectedEvent.category
      ? await updateTodoItem({
          id: selectedEvent.id,
          title,
          status: "open",
          category: selectedOption,
          dateTime: input.dateTime,
        })
      : await updateAppointment({
          id: selectedEvent.id,
          title,
          status: "open",
          startTime: input.startTime,
          endTime: input.endTime,
        });
    if (response.data) {
      const map = new Map(JSON.parse(localStorage.getItem("map")));
      const googleCalendarEventId = map.get(selectedEvent?.id);
      const start = input.category? input.dateTime:input.startTime;
      const end = input.category? input.dateTime:input.endTime;
      const calendarResponse = await updateGoogleCalendarEvent({id:googleCalendarEventId,title,startTime:start,endTime:end});
      if(calendarResponse.data){
        toast.success(calendarResponse?.data?.message);
      }else{
        toast.error(calendarResponse?.error?.data?.error);
      }
      dispatch(updateSingleTodoItem({id:selectedEvent.id, data:response.data.data}))
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.error?.data?.error);
    }
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1000);
  };
  return (
    <>
      {type == "todo" ? (
        <div
          className={`relative w-[1530px] ml-[-158px] h-[645px] p-4 space-y-4 top-10 overflow-hidden ${dynamicClass}`}
        >
          <h2 className="text-2xl font-semibold">Update Todo</h2>

          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            name="title"
            size="small"
            id="title"
            sx={styleTextField}
            className="bg-white"
            value={title}
            onChange={handleInputEvent}
          />

          <TextField
            select
            label="Category"
            variant="outlined"
            fullWidth
            name="category"
            id="category"
            size="small"
            sx={styleTextField}
            value={selectedOption}
            onChange={handleChange}
            className="text-left"
          >
            <MenuItem value="normal">{options[0]}</MenuItem>
            <MenuItem value="food">{options[1]}</MenuItem>
            <MenuItem value="other">{options[2]}</MenuItem>
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Date Time"
                value={dayjs(input.dateTime)}
                onChange={handleDateTime}
                format="YYYY-MM-DDThh:mm"
                sx={styleTextField}
                slotProps={{ textField: { size: "small" } }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <Button
            variant="contained"
            color="primary"
            onClick={confirmUpdateEvent}
          >
            Update Event
          </Button>
        </div>
      ) : (
        <>
          <div
            className={`relative w-[1530px] ml-[-158px] h-[645px] p-4 space-y-4 top-10 overflow-hidden ${dynamicClass}`}
          >
            <h2 className="text-2xl font-semibold">Update Appointment</h2>

            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              name="title"
              size="small"
              id="title"
              sx={styleTextField}
              className="bg-white"
              value={title}
              onChange={handleInputEvent}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  label="Start Time"
                  value={dayjs(input.startTime)}
                  onChange={handleStartTime}
                  format="YYYY-MM-DDThh:mm"
                  sx={styleTextField}
                  slotProps={{ textField: { size: "small" } }}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  label="End Time"
                  value={dayjs(input.endTime)}
                  onChange={handleEndTime}
                  format="YYYY-MM-DDThh:mm"
                  sx={styleTextField}
                  slotProps={{ textField: { size: "small" } }}
                />
              </DemoContainer>
            </LocalizationProvider>

            <Button
              variant="contained"
              color="primary"
              onClick={confirmUpdateEvent}
            >
              Update Event
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateEventScreen;
