import { requestJson } from "../../../shared/api/client.js";

function authHeaders(accessToken) {
  return { Authorization: `Bearer ${accessToken}` };
}

export function fetchCollections(accessToken) {
  return requestJson("collections/", { headers: authHeaders(accessToken) });
}

export function createCollection(accessToken, details) {
  return requestJson("collections/", {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(details),
  });
}

export function saveRequest(accessToken, details) {
  return requestJson("requests/", {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(details),
  });
}