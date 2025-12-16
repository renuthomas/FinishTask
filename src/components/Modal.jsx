import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Modal = ({ isOpen, onClose, task, onSave }) => {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const {darkMode}=useTheme();

  const inputRef = useRef(null);
  const isEditMode = !!task;
  const isDarkMode = darkMode;
  const minDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;

    setContent(task?.content || "");
    setPriority(task?.priority || "low");
    setDueDate(task?.dueDate || "");

    inputRef.current?.focus();
  }, [isOpen, task]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSave(content.trim(), priority, dueDate || "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-8 
          ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}
          animate-in fade-in zoom-in duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-3xl font-light transition hover:scale-110
            ${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-700"}`}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Task" : "Add New Task"}
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Task Description
            </label>
            <input
              ref={inputRef}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="What needs to be done?"
              className={`w-full px-4 py-3 rounded-lg border transition focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border transition focus:ring-2 focus:ring-blue-500
                  ${isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-700"
                  }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Due Date (optional)
              </label>
              <input
                type="date"
                min={minDate}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border transition focus:ring-2 focus:ring-blue-500
                  ${isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 [&::-webkit-calendar-picker-indicator]:invert"
                    : "bg-gray-50 border-gray-300 text-gray-700"
                  }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg font-medium transition
                ${isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            >
              {isEditMode ? "Update" : "Add"} Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;