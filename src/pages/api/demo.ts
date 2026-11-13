import type { APIRoute } from "astro";

const VARIANTS = new Set([
  "Doctor",
  "Clinic",
  "Hospital",
  "Laboratory",
  "Other",
  "MGW",
  "LARIS",
  "IntelliSist",
]);

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify({ ok: false, error: "Invalid body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = body as Record<string, unknown>;
  const variant = typeof data.variant === "string" ? data.variant.trim() : "";
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const city = typeof data.city === "string" ? data.city.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";

  if (!VARIANTS.has(variant)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid practice type" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!name || name.length < 2) {
    return new Response(JSON.stringify({ ok: false, error: "Name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!phone || phone.length < 7) {
    return new Response(JSON.stringify({ ok: false, error: "Phone is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const lead = {
    variant,
    name,
    phone,
    city: city || null,
    email: email || null,
    receivedAt: new Date().toISOString(),
  };

  console.log("[demo-lead]", JSON.stringify(lead));

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
