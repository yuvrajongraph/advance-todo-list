import React, { useState } from "react";
import Modal from "react-modal";
import { useCreateTodoItemMutation } from "../../redux/todo/todoApi";
import { toast } from "react-toastify";
import ModalNavbar from "./ModalNavbar";

// Modal.setAppElement("#root");

const CustomModal = ({
  showTodo,
  isOpen,
  input,
  setInput,
  setIsOpen,
  popupPosition,
}) => {
  // const [modalIsOpen, setModalIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("normal");
  const options = ["normal", "food", "other"];
  const [activeLink, setActiveLink] = useState("category");

  const { title, category, dateTime, description } = input;
  // const [selectedEvent, setSelectedEvent] = useState(null);

  const [createTodoItem] = useCreateTodoItemMutation();

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
  const saveTodo = async (e) => {
    e.preventDefault();
    const response = await createTodoItem({
      title,
      status: "open",
      category: selectedOption,
      dateTime: dateTime,
    });

    if (response.data) {
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.error?.data?.error);
    }
    setInput({
      title: "",
      category: "",
      dateTime: "",
      description: "",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  //   const closeModal = () => {
  //     setIsOpen(false);
  //   };

  return (
    <>
      {/* {isOpen && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 bg-black opacity-50 z-50"
          onClick={closeModal}
        />
      )} */}
      {isOpen && (
        <>
          <div
            className="transform -translate-x-1/2 -translate-y-1/2 z-50 w-1/5 mt-3"
            style={{
              position: "fixed",
              top: popupPosition.top,
              left: popupPosition.left,
            }}
          >
            <div className="bg-[#E6E6E6] p-4 rounded shadow ">
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
                {activeLink === "category" ? (
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
                ) : (
                  <>
                    <div className="mb-4 ">
                      <label
                        className="block text-gray-600 text-sm font-semibold mb-2"
                        htmlFor="DateTime"
                      >
                        DateTime
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="dateTime"
                        name="dateTime"
                        value={dateTime}
                        onChange={handleInputEvent}
                      />
                    </div>
                    <div className="mb-4 ">
                      <label
                        className="block text-gray-600 text-sm font-semibold mb-2"
                        htmlFor="Description"
                      >
                        Description
                      </label>
                        <input
                          className="w-full border p-2 rounded"
                          type="text"
                          id="description"
                          name="description"
                          placeholder="Add description"
                          value={description}
                          onChange={handleInputEvent}
                          style={{
                            padding: "20px"
                          }}
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
                    Save Todo
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
