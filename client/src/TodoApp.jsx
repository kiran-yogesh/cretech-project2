import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TodoApp({ setToken }) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/todos");
      setTodos(data);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/todos", {
        title: newTodo,
        completed: false,
        dueDate: null,
        priority: "Medium",
      });
      setTodos((prev) => [...prev, data]);
      setNewTodo("");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id, completed) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/todos/${id}`, {
        completed: !completed,
      });
      setTodos(todos.map((t) => (t._id === id ? data : t)));
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } finally {
      setLoading(false);
    }
  };

  const clearCompleted = async () => {
    setLoading(true);
    try {
      for (const todo of todos.filter((t) => t.completed)) {
        await axios.delete(`/todos/${todo._id}`);
      }
      setTodos(todos.filter((t) => !t.completed));
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
    setEditPriority(todo.priority || "Medium");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditDueDate("");
    setEditPriority("Medium");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.put(`/todos/${id}`, {
        title: editTitle,
        dueDate: editDueDate || null,
        priority: editPriority,
      });
      setTodos(todos.map((t) => (t._id === id ? data : t)));
      cancelEdit();
    } finally {
      setLoading(false);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setTodos(items);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;

  // Updated priority background gradients with glowing shadows
  const priorityBgColors = {
    High: "bg-gradient-to-r from-red-500 to-red-700 shadow-[0_0_15px_#f87171]",
    Medium:
      "bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_0_15px_#facc15]",
    Low: "bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_15px_#34d399]",
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay to dim background for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70 pointer-events-none"></div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 w-48 bg-indigo-900 bg-opacity-90 shadow-xl p-6 flex flex-col space-y-6 text-white"
      >
        <h2 className="text-xl font-bold mb-4 tracking-wide drop-shadow-lg">
          Filters
        </h2>
        {["all", "active", "completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            disabled={filter === type}
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition
              ${
                filter === type
                  ? "bg-pink-600 text-white shadow-lg"
                  : "hover:bg-indigo-700 text-indigo-200"
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        <button
          onClick={clearCompleted}
          disabled={completedCount === 0 || loading}
          className={`mt-auto bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-bold transition
            ${
              completedCount === 0 || loading
                ? "opacity-50 cursor-not-allowed"
                : "shadow-lg text-white"
            }`}
        >
          Clear Completed
        </button>
        <button
          onClick={logout}
          className="mt-4 bg-red-800 hover:bg-red-900 px-4 py-2 rounded-lg font-bold shadow-lg transition"
        >
          Logout
        </button>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ x: 500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative z-10 flex-1 p-10 max-w-3xl mx-auto text-white"
      >
        <h1 className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-lg">
          Advanced To-Do List
        </h1>

        {/* Add Todo */}
        <form onSubmit={addTodo} className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            disabled={loading}
            className="flex-grow px-5 py-3 rounded-lg bg-indigo-900 bg-opacity-80 text-white placeholder-indigo-300 focus:outline-none focus:ring-4 focus:ring-pink-500 transition shadow-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 px-6 rounded-lg font-semibold shadow-lg transition transform hover:scale-110"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        <p className="mb-6 text-indigo-300 font-semibold text-center tracking-wide drop-shadow-md">
          Total: {totalCount} | Active: {activeCount} | Completed:{" "}
          {completedCount}
        </p>

        {/* Todo List */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
                <AnimatePresence>
                  {filteredTodos.map(
                    ({ _id, title, completed, dueDate, priority }, index) => (
                      <Draggable key={_id} draggableId={_id} index={index}>
                        {(provided) => (
                          <motion.li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            layout
                            className={`rounded-xl p-6 flex justify-between items-center cursor-pointer
                            ${priorityBgColors[priority]} 
                            ${
                              completed
                                ? "opacity-60 line-through text-gray-300"
                                : "text-white"
                            }
                            hover:scale-[1.03] transition-transform duration-300 shadow-lg`}
                            style={provided.draggableProps.style}
                          >
                            {editId === _id ? (
                              <div className="flex flex-col flex-grow mr-4">
                                <input
                                  className="mb-3 px-4 py-2 rounded-md bg-indigo-800 bg-opacity-90 text-white placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-pink-500 transition shadow-md"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  disabled={loading}
                                />
                                <div className="flex gap-4 mb-3 items-center">
                                  <input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) =>
                                      setEditDueDate(e.target.value)
                                    }
                                    className="rounded-md px-3 py-2 bg-indigo-800 bg-opacity-90 text-white focus:outline-none focus:ring-4 focus:ring-pink-500 shadow-md"
                                    disabled={loading}
                                  />
                                  <select
                                    value={editPriority}
                                    onChange={(e) =>
                                      setEditPriority(e.target.value)
                                    }
                                    className="rounded-md px-3 py-2 bg-indigo-800 bg-opacity-90 text-white focus:outline-none focus:ring-4 focus:ring-pink-500 shadow-md"
                                    disabled={loading}
                                  >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                  </select>
                                </div>
                                <div className="flex gap-4">
                                  <button
                                    onClick={() => saveEdit(_id)}
                                    disabled={loading}
                                    className="bg-pink-600 hover:bg-pink-700 px-5 py-2 rounded-lg font-semibold shadow-lg transition transform hover:scale-110"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    disabled={loading}
                                    className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg font-semibold shadow-lg transition transform hover:scale-110"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div
                                  className="flex items-center flex-grow"
                                  onClick={() => toggleComplete(_id, completed)}
                                >
                                  <input
                                    type="checkbox"
                                    checked={completed}
                                    readOnly
                                    className="cursor-pointer w-7 h-7 rounded-md mr-4"
                                  />
                                  <div>
                                    <p
                                      className={`font-bold text-xl select-none ${
                                        completed
                                          ? "line-through text-gray-300"
                                          : ""
                                      }`}
                                    >
                                      {title}
                                    </p>
                                    {dueDate && (
                                      <p
                                        className={`text-sm select-none ${
                                          new Date(dueDate) < new Date() &&
                                          !completed
                                            ? "text-red-400 font-extrabold"
                                            : "text-indigo-200"
                                        }`}
                                      >
                                        Due:{" "}
                                        {new Date(dueDate).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <span
                                    className={`px-4 py-1 rounded-full font-semibold text-sm tracking-wider select-none
                                  ${
                                    priority === "High"
                                      ? "bg-red-700 text-red-100 shadow-[0_0_10px_#f87171]"
                                      : priority === "Medium"
                                      ? "bg-yellow-700 text-yellow-100 shadow-[0_0_10px_#facc15]"
                                      : "bg-green-700 text-green-100 shadow-[0_0_10px_#34d399]"
                                  }`}
                                    title={`Priority: ${priority}`}
                                  >
                                    {priority}
                                  </span>

                                  <button
                                    onClick={() =>
                                      startEdit({
                                        _id,
                                        title,
                                        dueDate,
                                        priority,
                                      })
                                    }
                                    className="text-pink-300 hover:text-pink-100 transition text-2xl"
                                    aria-label="Edit todo"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => deleteTodo(_id)}
                                    className="text-red-400 hover:text-red-200 transition text-2xl"
                                    aria-label="Delete todo"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </>
                            )}
                          </motion.li>
                        )}
                      </Draggable>
                    )
                  )}
                </AnimatePresence>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </motion.main>
    </div>
  );
}
