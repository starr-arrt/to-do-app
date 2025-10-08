"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { Sun, Moon, Plus, Edit2, Trash2 } from "lucide-react";

export default function Page() {
  // ------------------ STATE ------------------
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState<
    { id: number; text: string; date: Date | null }[]
  >([]);
  const [taskText, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState<Date | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // ------------------ LOAD TASKS ------------------
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      const cleaned = (parsed || [])
        .filter((t: any) => t && t.text && t.text.trim() !== "") // remove empties
        .map((t: any) => ({
          id: typeof t.id === "number" ? t.id : Number(t.id),
          text: t.text,
          date: t.date ? new Date(t.date) : null,
        }));
      setTasks(cleaned);
    }
  }, []);

  // ------------------ SAVE TASKS ------------------
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ------------------ ADD / UPDATE TASK ------------------
  const addOrUpdateTask = () => {
    if (!taskText.trim()) return;

    if (editingTaskId !== null) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId ? { ...t, text: taskText, date: taskDate } : t
        )
      );
      setEditingTaskId(null);
    } else {
      // Add new
      setTasks((prev) => [
        ...prev,
        { id: Date.now(), text: taskText, date: taskDate },
      ]);
    }

    setTaskText("");
    setTaskDate(null);
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const startEditing = (task: { id: number; text: string; date: Date | null }) => {
    setTaskText(task.text);
    setTaskDate(task.date);
    setEditingTaskId(task.id);
  };

  // ------------------ THEMES ------------------
  const lightGradient = "bg-gradient-to-br from-gray-100 via-white to-gray-200";
  const darkGradient = "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900";

  return (
    <div
      className={`${darkMode ? darkGradient : lightGradient} min-h-screen flex flex-col items-center py-10 px-4 transition-colors duration-500`}
    >
      {/* Background floating gradients (non-interactive) */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none"
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        style={{ top: "10%", left: "5%" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"
        animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
        style={{ bottom: "15%", right: "10%" }}
      />

      {/* CONTENT: ensure it's above the blobs */}
      <div className="relative z-10 w-full max-w-2xl mx-auto py-6">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-8">
          <h1
            className={`text-4xl font-bold tracking-tight ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Task Manager
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border shadow-sm hover:scale-105 transition"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-300" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Task Input */}
        <div
          className={`w-full p-6 rounded-2xl shadow-lg flex flex-col gap-4 ${
            darkMode ? "bg-gray-800/70 text-gray-100" : "bg-white/70 text-gray-900"
          }`}
        >
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Enter task name..."
            className={`w-full p-3 rounded-lg border focus:outline-none ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
                : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
          <DatePicker
            selected={taskDate}
            onChange={(date) => setTaskDate(date)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select due date & time..."
            className={`w-full p-3 rounded-lg border focus:outline-none ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
                : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
          <button
            onClick={addOrUpdateTask}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-lg transition ${
              darkMode
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <Plus className="w-5 h-5" />
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>
        </div>

        {/* Task List */}
        <div className="w-full mt-8 space-y-4">
          {tasks.length === 0 ? (
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              No tasks yet. Add one above!
            </p>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-xl shadow-md ${
                  darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <p className="font-medium">{task.text}</p>
                  {task.date && (
                    <p className="text-sm text-gray-400">
                      {task.date.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEditing(task)}
                    className="p-2 rounded-md bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900 transition cursor-pointer"
                    title="Edit task"
                    aria-label="Edit task"
                  >
                    <Edit2 className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-md bg-transparent hover:bg-red-50 dark:hover:bg-red-900 transition cursor-pointer"
                    title="Delete task"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
