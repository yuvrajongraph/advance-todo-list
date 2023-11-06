import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  formatDateToYYYYMMDDTHHMM,
  formatDateToYYYYMMDD,
} from "../../utils/dateConversion";
import EventContext from "../../Context/Event/EventContext";
import { useUpdateTodoItemMutation } from "../../redux/todo/todoApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import DarkThemeContext from "../../Context/DarkTheme/DarkThemeContext";
import "./UpdateEventScreen.css"


const UpdateEventScreen = () => {
  const calendarEvent = useContext(EventContext);
  const { selectedEvent, setSelectedEvent } = calendarEvent;
  const [updateTodoItem] = useUpdateTodoItemMutation();
  const {dark,toggleTheme} = useContext(DarkThemeContext);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    title: selectedEvent.title,
    category: selectedEvent.category,
    dateTime: formatDateToYYYYMMDDTHHMM(new Date(selectedEvent.start)),
  });
  const styleTextField = dark? {
    'label.Mui-focused': {
      color: 'blue', 
    },
    'label': {
      color: 'red', 
      
    },
    '.MuiInputBase-input':{
      color:'white',
      backgroundColor:'black'
    },
    '.MuiButtonBase-root':{
      color:'white',
      backgroundColor:'black'
    }
  }:{}
  const dynamicClass = dark ? 'bg-[#282828] text-white':'';

  const { title, category } = input;
  const handleInputEvent = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput(() => {
      return { ...input, [name]: value };
    });
    
  };

  const handleDateTime = (e) => {
    setInput(()=>{
        return {...input,dateTime:e.$d}
    })
  };

  const confirmUpdateEvent = async (e) => {
    const response = await updateTodoItem({
      id: selectedEvent.id,
      title,
      status: "open",
      category,
      dateTime: input.dateTime,
    });
    console.log(response);
    if (response.data) {
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.error?.data?.error);
    }
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
  };
  return (
    <>
      <div className={`relative w-[1530px] ml-[-158px] h-[645px] p-4 space-y-4 top-10 overflow-hidden ${dynamicClass}`} >
        <h2 className="text-2xl font-semibold">Update Event</h2>

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
          label="Category"
          variant="outlined"
          fullWidth
          name="category"
          id="category"
          size="small"
          sx={styleTextField}
          value={category}
          onChange={handleInputEvent}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker"]}>
            <DateTimePicker
              label="Date Time"
              value={dayjs(input.dateTime)}
              onChange={handleDateTime}
              format="YYYY-MM-DDThh:mm"
              sx={styleTextField}
              slotProps={{ textField: { size: 'small' } }}
            />
          </DemoContainer>
        </LocalizationProvider>

        {/* <TextField
        label="Date"
        type="dateTime-local"
        value={input.dateTime}
        onChange={handleInputEvent}
        InputLabelProps={{
          shrink: true,
        }}
      /> */}

        <Button
          variant="contained"
          color="primary"
          onClick={confirmUpdateEvent}
        >
          Update Event
        </Button>
      </div>
    </>
  );
};

export default UpdateEventScreen;
