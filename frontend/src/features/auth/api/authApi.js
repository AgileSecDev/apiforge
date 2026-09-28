import { requestJson } from "../../../shared/api/client.js";

const SESSION_KEY = "apiforge.session";

export function login(credentials) {
  return requestJson("auth/token/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function register(details) {
  return requestJson("accounts/register/", {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveSession(tokens, username) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...tokens, username }));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}