import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";


const ListItems = ({
  task,
  index,
  toggleComplete,
  deleteTask,
  onEdit,
  handleDragOver,
  handleDragStart,
  handleDrop,
}) => {
  const { id, content, completed, priority, dueDate } = task;
  const today = new Date().toISOString().split("T")[0];
  const {darkMode}=useTheme();
  const isDark=darkMode;



  const priorityColor = {
    low: isDark ? "text-blue-400" : "text-blue-600",
    medium: isDark ? "text-yellow-400" : "text-yellow-600",
    high: isDark ? "text-red-400 font-semibold" : "text-red-600 font-semibold",
  };

  const isOverdue = !completed && dueDate && dueDate < today;
  const hasValidDueDate = dueDate && !isNaN(new Date(dueDate).getTime());

  const bgAndBorder = completed
    ? isDark
      ? "bg-green-900/30 border-green-700"
      : "bg-green-50 border-green-300"
    : isOverdue
    ? isDark
      ? "bg-red-900/40 border-red-700"
      : "bg-rose-100 border-rose-300"
    : isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-gray-50 border-gray-200";

  return (
    <li
      draggable="true"
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        flex items-center justify-between p-4 rounded-xl border transition-all
        cursor-move select-none hover:shadow-lg hover:scale-[1.01]
        ${bgAndBorder}
      `}
    >
      <div className="flex items-center gap-4 flex-1">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => toggleComplete(id)}
          className={`
            w-5 h-5 rounded focus:ring-2 focus:ring-offset-2 cursor-pointer
            ${isDark
              ? "text-blue-500 focus:ring-blue-400 focus:ring-offset-gray-900"
              : "text-blue-600 focus:ring-blue-500"
            }
          `}
        />

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              {index + 1}.
            </span>
            <span
              className={`
                text-lg font-medium transition-colors
                ${completed
                  ? "line-through text-gray-500"
                  : isDark
                  ? "text-gray-100"
                  : "text-gray-900"
                }
              `}
            >
              {content}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm">
            {priority && (
              <span className={`capitalize font-medium ${priorityColor[priority]}`}>
                • {priority}
              </span>
            )}

            <span className={isDark ? "text-gray-400" : "text-gray-500"}>
              {hasValidDueDate
                ? new Date(dueDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "No due date"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!completed && (
          <button
            onClick={onEdit}
            className={`transition hover:scale-110 ${
              isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
            }`}
            aria-label="Edit task"
          >
            <FaEdit size={19} />
          </button>
        )}

        <button
          onClick={() => deleteTask(id)}
          className={`transition hover:scale-110 ${
            isDark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700"
          }`}
          aria-label="Delete task"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </li>
  );
};

export default ListItems;