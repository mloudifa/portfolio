import { addContactMessage } from "@/lib/db/repo";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || name.length < 2) {
    return Response.json({ error: "Please provide your name" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please provide a valid email address" }, { status: 400 });
  }
  if (message.length < 10) {
    return Response.json({ error: "Message must be at least 10 characters" }, { status: 400 });
  }

  await addContactMessage({ name, email, message });

  return Response.json({ ok: true });
}
