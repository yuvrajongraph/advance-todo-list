import React,{useContext} from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useDeleteTodoItemMutation } from "../../redux/todo/todoApi";
import { useDeleteAppointmentMutation } from "../../redux/appointment/appointmentApi";
import { toast } from "react-toastify";
import { useDeleteGoogleCalendarEventMutation } from "../../redux/auth/authApi";
import CalendarContext from "../../Context/Calendar/CalendarContext";



const DeletePopUpScreen = ({
  deletePopUp,
  setDeletePopUp,
  popupPosition,
  selectedEvent,
  setSelectedEvent,
}) => {
  const [deleteTodoItem] = useDeleteTodoItemMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const [deleteGoogleCalendarEvent] = useDeleteGoogleCalendarEventMutation();
  const handleClose = () => {
    setDeletePopUp(false);
  };
  const {map,setMap} = useContext(CalendarContext);
  const confirmDeleteEvent = async (e) => {
    setDeletePopUp(false);
    const response = selectedEvent.category? await deleteTodoItem({ id: selectedEvent?.id }): await deleteAppointment({id:selectedEvent?.id});
    if (response.data) {
      const map = new Map(JSON.parse(localStorage.getItem("map")));
      const googleCalendarEventId = map.get(selectedEvent?.id);
      const calendarResponse = await deleteGoogleCalendarEvent({id:googleCalendarEventId});
      if(calendarResponse.data){
        toast.success(calendarResponse?.data?.message);
      }else{
        toast.error(calendarResponse?.error?.data?.error);
      }
      toast.success(response?.data?.message);
      map.delete(selectedEvent?.id)
      localStorage.setItem("map", JSON.stringify(Array.from(map)));
    } else {
      toast.error(response?.error?.data?.error);
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  return (
    <>
      <Modal open={deletePopUp} onClose={handleClose}>
        <div
          className="fixed transform -translate-x-1/2 -translate-y-1/2 z-50 w-1/5 mt-3"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <div className="bg-[#E6E6E6] p-4 rounded shadow ">
            <h2>Delete Event</h2>
            <p>Are you sure you want to delete?</p>
            <Button
              variant="contained"
              color="primary"
              className="m-3"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="m-3"
              style={{margin:"5px"}}
              onClick={confirmDeleteEvent}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeletePopUpScreen;
