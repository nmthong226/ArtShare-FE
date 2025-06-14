import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectToNotifications(userId: string): Socket {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io("http://localhost:3000/notifications", {
    query: { userId },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("[Socket] connected with ID →", socket!.id);
  });
  socket.on("disconnect", (reason) => {
    console.log("[Socket] disconnected:", reason);
  });

  return socket;
}

export function getNotificationsSocket(): Socket | null {
  return socket;
}

export function disconnectFromNotifications() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}