const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

function messageFromPayload(payload) {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return "The request could not be completed.";

  const messages = Object.entries(payload).flatMap(([field, value]) => {
    const entries = Array.isArray(value) ? value : [value];
    return entries
      .filter((entry) => typeof entry === "string")
      .map((entry) => (field === "detail" || field === "non_field_errors" ? entry : `${field}: ${entry}`));
  });

  return messages.join(" ") || "The request could not be completed.";
}

export async function requestJson(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/${path.replace(/^\//, "")}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Could not reach ApiForge. Check that the backend is running.");
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(messageFromPayload(payload));
  }

  return payload;
}