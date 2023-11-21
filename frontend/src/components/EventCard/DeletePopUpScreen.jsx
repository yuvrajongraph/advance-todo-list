import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useDeleteTodoItemMutation } from "../../redux/todo/todoApi";
import { useDeleteAppointmentMutation } from "../../redux/appointment/appointmentApi";
import { toast } from "react-toastify";



const DeletePopUpScreen = ({
  deletePopUp,
  setDeletePopUp,
  popupPosition,
  selectedEvent,
  setSelectedEvent,
}) => {
  const [deleteTodoItem] = useDeleteTodoItemMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const handleClose = () => {
    setDeletePopUp(false);
  };

  const confirmDeleteEvent = async (e) => {
    setDeletePopUp(false);
    const response = selectedEvent.dateTime? await deleteTodoItem({ id: selectedEvent?.id }): await deleteAppointment({id:selectedEvent?.id});
    if (response.data) {
      toast.success(response?.data?.message);
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
