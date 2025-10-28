import { NextResponse } from "next/server";

// Simulated in-memory database
let tasks: { id: number; name: string; note?: string; deadline?: string }[] = [];
let nextId = 1;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { command, data } = body;

    if (!command) {
      return NextResponse.json({ error: "Command not provided" }, { status: 400 });
    }

    if (command === "add task") {
      const { name, note, deadline } = data || {};
      if (!name) {
        return NextResponse.json({ error: "Task name is required" }, { status: 400 });
      }
      const newTask = { id: nextId++, name, note, deadline };
      tasks.push(newTask);
      return NextResponse.json({ message: "Task added successfully", task: newTask });
    }

    if (command === "list tasks") {
      return NextResponse.json({ tasks });
    }

    return NextResponse.json({ error: "Unknown command" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process command", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  // For testing: list all tasks
  return NextResponse.json({ tasks });
}
