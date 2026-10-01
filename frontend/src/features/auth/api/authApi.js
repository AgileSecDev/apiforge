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

export function requestPasswordReset(email) {
  return requestJson("accounts/password-reset/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function confirmPasswordReset(details) {
  return requestJson("accounts/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export function fetchProfile(accessToken) {
  return requestJson("accounts/me/", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function updateProfile(accessToken, details) {
  return requestJson("accounts/me/", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
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

export function updateSessionProfile(profile) {
  const session = getSession();
  if (session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, username: profile.username }));
  }
}