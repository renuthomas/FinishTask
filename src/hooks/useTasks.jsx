import { useState, useEffect, useCallback } from "react";

const TASKS_KEY = "tasks";

export default function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(TASKS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse tasks", e);
        return [];
      }
    }else{
      return [];
    }
  });

  useEffect(() => {
     localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((content, priority = "low", dueDate = "") => {
    const newTask = {
      id: Date.now(),
      content: content.trim(),
      completed: false,
      priority,
      dueDate,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, []);
  
  const reorderTasks = useCallback((draggedId, droppedOnId) => {
  console.log("Reordering", draggedId, droppedOnId);
    setTasks(prev => {
      const list = [...prev];
      // FIX: Ensure IDs are treated as numbers for reliable comparison
      const numDraggedId = Number(draggedId);
      const numDroppedOnId = Number(droppedOnId);
      
      const fromIdx = list.findIndex(t => t.id === numDraggedId);
      const toIdx = list.findIndex(t => t.id === numDroppedOnId);
      console.log("fromidx",fromIdx,"toidx",toIdx)
      
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;
      const [task] = list.splice(fromIdx, 1);
      //console.log("task",task)
      list.splice(toIdx, 0, task);
      return list;
    });
  }, []);


  return {
    tasks,
    addTask,
    reorderTasks,
    updateTask,
    deleteTask,
    toggleComplete,
    clearCompleted,
  };
}