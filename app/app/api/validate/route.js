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
  