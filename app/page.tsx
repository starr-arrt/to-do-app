"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Moon, Sun, Edit, Trash2, PlusCircle, CalendarDays, List } from "lucide-react";

interface Task {
  id: number;
  name: string;
  deadline: Date;
  note?: string;
  notified?: boolean;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [calendarView, setCalendarView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ---------------- Load Saved Tasks + Theme ----------------
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedTheme = localStorage.getItem("theme");

    if (savedTasks) {
      const parsed = JSON.parse(savedTasks).map((t: any) => ({
        ...t,
        deadline: new Date(t.deadline),
      }));
      setTasks(parsed);
    }
    if (savedTheme === "dark") setDarkMode(true);

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    if ("serviceWorker" in navigator) {
      const swPath = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/sw.js`;
      navigator.serviceWorker
        .register(swPath, { scope: "/" })
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) => console.error("❌ SW registration failed:", err));
    }
  }, []);

  // ---------------- Save Tasks + Theme ----------------
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ---------------- Notifications ----------------
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTasks((prev) =>
        prev.map((task) => {
          const diff = (task.deadline.getTime() - now.getTime()) / 60000;
          if (diff > 4 && diff <= 5 && !task.notified && Notification.permission === "granted") {
            new Notification("⏰ Task Reminder", {
              body: task.note
                ? `Your task "${task.name}" is due in 5 minutes.\nNote: ${task.note}`
                : `Your task "${task.name}" is due in 5 minutes!`,
              icon: "/favicon.ico",
            });
            return { ...task, notified: true };
          }
          return task;
        })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- CRUD ----------------
  const handleAddTask = () => {
    if (!taskName || !deadline) return alert("Please enter a task name and select a deadline.");
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, name: taskName, deadline, note, notified: false }
            : t
        )
      );
      setEditingTask(null);
    } else {
      setTasks((prev) => [
        ...prev,
        { id: Date.now(), name: taskName, deadline, note, notified: false },
      ]);
    }
    setTaskName("");
    setDeadline(null);
    setNote("");
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskName(task.name);
    setDeadline(new Date(task.deadline));
    setNote(task.note || "");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  // ---------------- Styles ----------------
  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-slate-700"
    : "bg-gradient-to-br from-slate-50 via-gray-100 to-gray-200";

  const headerTextColor = darkMode ? "text-white" : "text-gray-900";

  // ---------------- Calendar ----------------
  const tileContent = ({ date }: { date: Date }) => {
    const dayTasks = tasks.filter(
      (t) => t.deadline.toDateString() === date.toDateString()
    );
    if (dayTasks.length === 0) return null;
    return (
      <div className="flex flex-col items-center mt-1 space-y-1">
        {dayTasks.map((t) => (
          <div
            key={t.id}
            className={`text-[0.55rem] text-center rounded-md px-1 py-0.5 truncate max-w-[55px] ${
              darkMode
                ? "bg-indigo-500/40 text-indigo-100"
                : "bg-indigo-200 text-indigo-800"
            }`}
            title={t.name}
          >
            {t.name.length > 8 ? t.name.slice(0, 7) + "…" : t.name}
          </div>
        ))}
      </div>
    );
  };

  const tasksForSelectedDate = tasks.filter(
    (t) => t.deadline.toDateString() === selectedDate.toDateString()
  );

  const calendarStyle = `
    .react-calendar {
      border: none !important;
      width: 100%;
      border-radius: 1rem;
      background: ${darkMode ? "#1f2937" : "#ffffff"};
      color: ${darkMode ? "#f3f4f6" : "#111827"};
      box-shadow: ${darkMode ? "0 0 20px rgba(255,255,255,0.1)" : "0 0 10px rgba(0,0,0,0.1)"};
      transition: all 0.3s ease;
    }
    .react-calendar__navigation button {
      color: ${darkMode ? "#f3f4f6" : "#111827"} !important;
      background: transparent;
      font-weight: 600;
    }
    .react-calendar__month-view__weekdays {
      color: ${darkMode ? "#9ca3af" : "#374151"} !important;
    }
    .react-calendar__tile {
      color: ${darkMode ? "#f3f4f6" : "#111827"} !important;
      border-radius: 0.5rem;
    }
    .react-calendar__tile--active {
      background: ${darkMode ? "#38bdf8" : "#60a5fa"} !important;
      color: white !important;
    }
    .react-calendar__tile:hover {
      background: ${darkMode ? "#374151" : "#e5e7eb"} !important;
    }
    .react-calendar__tile--now {
      background: ${darkMode ? "rgba(56,189,248,0.2)" : "rgba(96,165,250,0.2)"} !important;
      border: 1px solid ${darkMode ? "#38bdf8" : "#60a5fa"} !important;
      border-radius: 0.5rem;
    }
  `;

  // ---------------- UI ----------------
  return (
    <div className={`min-h-screen transition-colors duration-700 ${bgGradient} flex flex-col items-center py-12`}>
      <style>{calendarStyle}</style>

      {/* Floating Orbs */}
      <motion.div
        className="absolute w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        style={{ top: "10%", left: "5%" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, -25, 0], x: [0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 14 }}
        style={{ bottom: "15%", right: "10%" }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-xl ${
          darkMode ? "bg-gray-800/70" : "bg-white/70"
        } backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-semibold tracking-wide ${headerTextColor}`}>
            Task Manager
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCalendarView(!calendarView)}
              className="p-2 bg-white/30 hover:bg-white/40 rounded-full transition"
            >
              {calendarView ? <List size={20} /> : <CalendarDays size={20} />}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-white/30 hover:bg-white/40 rounded-full transition"
            >
              {darkMode ? <Sun size={20} color="yellow" /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Switch Views */}
        <AnimatePresence mode="wait">
          {!calendarView ? (
            // 🔹 TASK VIEW
            <motion.div key="taskview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Input Section */}
              <div className="flex flex-col gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Enter task name..."
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="p-3 rounded-lg bg-white/80 w-full text-gray-900 placeholder-gray-500 outline-none"
                />
                <DatePicker
                  selected={deadline}
                  onChange={(date) => setDeadline(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select deadline..."
                  className="p-3 rounded-lg bg-white/80 w-full text-gray-900 placeholder-gray-500 outline-none"
                />
                <textarea
                  placeholder="Add a note (optional)..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="p-3 rounded-lg bg-white/80 w-full text-gray-900 placeholder-gray-500 outline-none"
                  rows={3}
                ></textarea>
                <button
                  onClick={handleAddTask}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 transition font-medium shadow-md"
                >
                  <PlusCircle size={18} />
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>

              {/* Task List */}
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <p
                    className={`text-center italic ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No tasks yet. Add one to get started!
                  </p>
                ) : (
                  tasks.map((task) => {
                    const now = new Date();
                    const timeLeft = (task.deadline.getTime() - now.getTime()) / 60000;
                    const dueSoon = timeLeft > 0 && timeLeft < 5;
                    const overdue = timeLeft < 0;

                    return (
                      <motion.div
                        key={task.id}
                        className={`flex justify-between items-start p-4 rounded-lg transition-all ${
                          dueSoon
                            ? "bg-sky-100 border border-sky-400"
                            : overdue
                            ? "bg-red-200/90 border border-red-400"
                            : "bg-white/80 border border-gray-300"
                        } shadow-md`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">{task.name}</h3>
                          <p className="text-sm text-gray-700">
                            Deadline:{" "}
                            {task.deadline.toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                          {task.note && (
                            <p className="text-sm mt-2 text-gray-800 italic">
                              Note: {task.note}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3 mt-1">
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          ) : (
            // 🔹 CALENDAR VIEW
            <motion.div key="calendarview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Calendar
                onChange={(date) => setSelectedDate(date as Date)}
                value={selectedDate}
                tileContent={tileContent}
              />
              <div className="mt-6">
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Tasks on {selectedDate.toDateString()}
                </h3>
                {tasksForSelectedDate.length === 0 ? (
                  <p
                    className={`italic ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No tasks for this day.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {tasksForSelectedDate.map((t) => (
                      <li
                        key={t.id}
                        className={`p-3 rounded-lg ${
                          darkMode
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <strong>{t.name}</strong>
                        <br />
                        <span className="text-sm opacity-80">
                          {t.deadline.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {t.note && (
                          <p className="text-sm mt-1 italic opacity-70">
                            {t.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
