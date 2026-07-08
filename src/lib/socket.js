import { io } from "socket.io-client";
import { serverRoot } from "@/services/api";

// Reuses the same NEXT_PUBLIC_API_URL env var as the rest of the app (minus
// the trailing /api) so socket + REST calls always point at the same
// backend, in both local dev and after deployment.
const socket = io(serverRoot, {
  withCredentials: true,
});

export default socket;