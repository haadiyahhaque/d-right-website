import type { APIRoute } from "astro";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const prerender = false;

const TRACKS = new Set(["mg-developer", "cta-advisor", "corporate"]);
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = new Set([".pdf", ".doc", ".docx"]);
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]);

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid form data" }, 400);
  }

  const track = str(form.get("track"));
  const name = str(form.get("name"));
  const phone = str(form.get("phone"));
  const email = str(form.get("email"));
  const city = str(form.get("city"));
  const organisation = str(form.get("organisation"));
  const cv = str(form.get("cv"));
  const note = str(form.get("note"));
  const fileEntry = form.get("cvFile");

  if (!TRACKS.has(track)) {
    return json({ ok: false, error: "Invalid track" }, 400);
  }
  if (!name || name.length < 2) {
    return json({ ok: false, error: "Name is required" }, 400);
  }
  if (!phone || phone.length < 7) {
    return json({ ok: false, error: "Phone is required" }, 400);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Valid email is required" }, 400);
  }
  if (cv && !/^https?:\/\//i.test(cv)) {
    return json({ ok: false, error: "CV link must start with http:// or https://" }, 400);
  }

  let savedFile: { originalName: string; storedName: string; size: number } | null = null;
  if (fileEntry instanceof File && fileEntry.size > 0) {
    if (fileEntry.size > MAX_BYTES) {
      return json({ ok: false, error: "CV file must be 5 MB or smaller" }, 400);
    }
    const originalName = fileEntry.name || "cv";
    const ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return json({ ok: false, error: "Upload a PDF, DOC or DOCX file" }, 400);
    }
    if (fileEntry.type && !ALLOWED_MIME.has(fileEntry.type)) {
      return json({ ok: false, error: "Upload a PDF, DOC or DOCX file" }, 400);
    }

    const uploadDir = path.join(process.cwd(), "uploads", "careers");
    await mkdir(uploadDir, { recursive: true });
    const storedName = `${Date.now()}-${randomUUID()}${ext}`;
    const dest = path.join(uploadDir, storedName);
    const buffer = Buffer.from(await fileEntry.arrayBuffer());
    await writeFile(dest, buffer);
    savedFile = { originalName, storedName, size: fileEntry.size };
  }

  if (track === "corporate") {
    if (!organisation || organisation.length < 2) {
      return json({ ok: false, error: "Organisation is required" }, 400);
    }
    if (!note || note.length < 8) {
      return json({ ok: false, error: "Please describe how you’d like to partner" }, 400);
    }
  } else if (!savedFile && !cv) {
    return json({ ok: false, error: "Please attach a CV or provide an online profile URL" }, 400);
  }

  const application = {
    track,
    name,
    phone,
    email,
    city: city || null,
    organisation: organisation || null,
    cv: cv || null,
    cvFile: savedFile,
    note: note || null,
    receivedAt: new Date().toISOString(),
  };

  console.log("[careers-application]", JSON.stringify(application));

  return json({ ok: true }, 200);
};

function str(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function json(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
