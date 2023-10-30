import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  useCreateTodoItemMutation,
  useGetAllTodoItemsMutation,
} from "../../redux/todo/todoApi";
import { toast } from "react-toastify";
import { formatDateToYYYYMMDD } from "../../utils/isoDateConversion";

const localizer = momentLocalizer(moment);

const BigCalendar = (props) => {
  const [todos, setTodos] = useState([]);
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showTodo, setShowTodo] = useState();
  const [selectedOption, setSelectedOption] = useState("normal");
  const options = ["normal", "food", "other"];
  const [input, setInput] = useState({
    title: "",
    category: "",
    dateTime: "",
  });
  const { title, category, dateTime } = input;
  // const [selectedEvent, setSelectedEvent] = useState(null);
  const events = [];

  const [getAllTodoItems] = useGetAllTodoItemsMutation();
  const [createTodoItem] = useCreateTodoItemMutation();
  const todoSchema = {
    title: "",
    status: "",
    category: "",
    dateTime: "",
  };

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

  const handleSlot = ({ start, end }) => {
    setShowTodo({ start, end });
    const dateTime = formatDateToYYYYMMDD(new Date(start));
    input.dateTime = dateTime;
  };

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
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  useEffect(() => {
    getTodoEvents();
  }, []);

  return (
    <>
      <div className="flex">
        <div className="w-2/3 pr-4 mt-3">
          <Calendar
            localizer={localizer}
            events={todos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: 700 }}
            onSelectSlot={handleSlot}
            selectable
          />
        </div>

        {showTodo && (
          <div className="w-1/3 mt-3">
            <div className="bg-[#E6E6E6] p-4 rounded shadow">
              <h2 className="text-2xl mb-4">Add Event</h2>
              <form>
                <div className="mb-4 ">
                  <label
                    className="block text-gray-600 text-sm font-semibold mb-2"
                    htmlFor="Title"
                  >
                    Title
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={handleInputEvent}
                  />
                </div>
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
        )}
      </div>
    </>
  );
};

export default BigCalendar;
