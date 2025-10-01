import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

// Schema
const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string", minLength: 1 },
    description: { type: "string" },
    dueDate: { type: "string", format: "date-time" },
    notes: { type: "string" },
    completed: { type: "boolean" }
  },
  required: ["id", "title", "dueDate"],
  additionalProperties: false
};

const validate = ajv.compile(schema);

export async function POST(req) {
  const body = await req.json();
  console.log("📝 Incoming request body:", body);

  const valid = validate(body);
  console.log("✅ Is valid?", valid);
  console.log("❌ Errors:", validate.errors);

  if (!valid) {
    return Response.json(
      { valid: false, errors: validate.errors },
      { status: 400 }
    );
  }

  return Response.json({ valid: true, message: "To-Do item is valid ✅" });
}
