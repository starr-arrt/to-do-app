"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>To-Do List (Sprint 3 Placeholder)</h1>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.description} (Due: {task.dueDate})
            </li>
          ))
        ) : (
          <p>Loading tasks...</p>
        )}
      </ul>
    </main>
  );
}
