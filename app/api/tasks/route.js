import { NextResponse } from "next/server";
import todos from "../../../sample-todos.json";  // ✅ correct path

export async function GET() {
  return NextResponse.json(todos);
}
