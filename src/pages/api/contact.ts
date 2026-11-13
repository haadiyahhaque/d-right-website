import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  if (!body || typeof body !== "object") {
    return json({ ok: false, error: "Invalid body" }, 400);
  }

  const data = body as Record<string, unknown>;
  const name = str(data.name);
  const email = str(data.email);
  const phone = str(data.phone);
  const subject = str(data.subject);
  const message = str(data.message);

  if (!name || name.length < 2) {
    return json({ ok: false, error: "Name is required" }, 400);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Valid email is required" }, 400);
  }
  if (!subject || subject.length < 2) {
    return json({ ok: false, error: "Subject is required" }, 400);
  }
  if (!message || message.length < 8) {
    return json({ ok: false, error: "Please enter a short message" }, 400);
  }

  const lead = {
    name,
    email,
    phone: phone || null,
    subject,
    message,
    receivedAt: new Date().toISOString(),
  };

  console.log("[contact-message]", JSON.stringify(lead));

  return json({ ok: true }, 200);
};

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function json(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
