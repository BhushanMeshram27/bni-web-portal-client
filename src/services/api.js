import axios from "axios";

// Single source of truth for the backend API base URL across the whole
// frontend. In development it falls back to the local backend; in
// production/deployment it MUST be supplied via NEXT_PUBLIC_API_URL so the
// deployed frontend talks to the deployed backend instead of localhost.
export const apiRoot =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Base URL for the raw server origin (no /api suffix) — used by things like
// the socket.io client that connect to the server root, not the API path.
export const serverRoot = apiRoot.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: apiRoot,
});

export default api;