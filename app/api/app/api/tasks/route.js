import sampleTodos from "../../../sample-todos.json";

export async function GET() {
  return Response.json(sampleTodos);
}
