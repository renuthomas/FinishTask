import { useMemo, useState } from "react";
import useTasks from "./hooks/useTasks.jsx";
import ListItems from "./components/ListItems";
import Modal from "./components/Modal";
import { FaLongArrowAltUp, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "./contexts/ThemeContext.jsx";

function App() {
  const {
    tasks,
    reorderTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    clearCompleted,
  } = useTasks();

  const {darkMode, setDarkMode} = useTheme();
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchInput, setSearchInput] = useState("");

  const getPriorityValue = (priority) => {
    const values = { low: 1, medium: 2, high: 3 };
    return values[priority] ?? 2;
  };


  const filteredTasks = useMemo(() => {
    if (filter === "Active") return tasks.filter((t) => !t.completed);
    if (filter === "Completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const sortedTasks = useMemo(() => {
    if (sortBy === "") return [...filteredTasks];

    return [...filteredTasks].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "dueDate") {
        aVal = aVal=="" ? new Date(null) : new Date(aVal);
        bVal = bVal=="" ? new Date(null) : new Date(bVal);
      }

      if (sortBy === "priority") {
        aVal = getPriorityValue(aVal);
        bVal = getPriorityValue(bVal);
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTasks, sortBy, sortOrder]);

  const searchedTasks = useMemo(() => {
    return sortedTasks.filter((task) =>
      task.content.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [sortedTasks, searchInput]);

  const handleSortByChange = (value) => {
    setSortBy(value);

    if (value === "priority") setSortOrder("desc");
    else if (value === "dueDate") setSortOrder("asc");
  };
  
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropTaskId) => {
    e.preventDefault();
    const draggedTaskId = parseInt(e.dataTransfer.getData("taskId"));
    if (!draggedTaskId || draggedTaskId === dropTaskId) return;
    reorderTasks(draggedTaskId, dropTaskId);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-8 mt-10 rounded-2xl shadow-lg transition-colors">

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            + Add New Task
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun className="text-yellow-500 text-xl" /> : <FaMoon className="text-indigo-600 text-xl" />}
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-right">
          {completedCount} of {totalCount} completed
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="ml-3 text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Clear completed
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-6 text-sm">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="All">All Tasks</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortByChange(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">None</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
            {sortBy && (
              <button
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                title="Toggle sort direction"
              >
                <FaLongArrowAltUp className={`text-lg transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <ul className="space-y-3">
          {searchedTasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {searchInput
                ? `No tasks found for "${searchInput}"`
                : filter === "All"
                ? "No tasks yet. Add one!"
                : `No ${filter.toLowerCase()} tasks.`}
            </p>
          ) : (
            searchedTasks.map((task, index) => (
              <ListItems
                key={task.id}
                index={index}
                task={task}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
                onEdit={() => openEditModal(task)}
                handleDragStart={(e) => handleDragStart(e, task.id)}
                handleDragOver={handleDragOver}
                handleDrop={(e) => handleDrop(e, task.id)}
              />
            ))
          )}
        </ul>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={editingTask}
          onSave={(content, priority, dueDate) => {
            if (editingTask) {
              updateTask(editingTask.id, { content, priority, dueDate: dueDate || "" });
            } else {
              addTask(content, priority, dueDate || "");
            }
            setIsModalOpen(false);
          }}
        />
      </div>
      <footer className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
      Created with ❤️ by <span className="font-medium"><a
        href="https://github.com/renuthomas"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        Renu Thomas
      </a></span>
      
    </footer>
    </div>
  );
}

export default App;