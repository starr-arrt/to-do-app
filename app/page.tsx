"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 relative">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">
          ✅ My To-Do List
        </h1>

        <ul className="space-y-6">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-white/10 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
            >
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">📌</span> {task.title}
              </h2>
              <p className="text-gray-300 italic mt-1">{task.description}</p>

              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-sm text-gray-400">
                <p>
                  <span className="font-medium text-gray-200">Due:</span>{" "}
                  {new Date(task.dueDate).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-200">Status:</span>{" "}
                  {task.status === "Pending" ? (
                    <span className="text-yellow-400">⏳ Pending</span>
                  ) : (
                    <span className="text-green-400">✅ Completed</span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating New Task Button */}
      <button
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white font-bold p-5 rounded-full shadow-lg transition-transform hover:scale-110"
        onClick={() => alert("Add Task functionality coming soon! 🚀")}
      >
        ➕
      </button>
    </main>
  );
}
