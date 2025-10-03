"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My To-Do List</h1>

      <div className="grid gap-6 max-w-3xl mx-auto">
        {tasks.map((task: any) => (
          <div
            key={task.id}
            className="p-6 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-700 mt-1">{task.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              <b>Due:</b>{" "}
              {new Date(task.dueDate).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p className="mt-2">
              <b>Status:</b>{" "}
              {task.completed ? (
                <span className="text-green-600 font-medium">✅ Completed</span>
              ) : (
                <span className="text-yellow-600 font-medium">⏳ Pending</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Floating Add Task Button */}
      <button className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition">
        ➕
      </button>
    </main>
  );
}
