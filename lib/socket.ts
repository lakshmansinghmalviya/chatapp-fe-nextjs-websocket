import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type MessageCallback = (message: string) => void;

let stompClient: Client | null = null;

export const connectWebSocket = (onMessageReceived: MessageCallback) => {
  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket as any,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ Connected to WebSocket");

      stompClient?.subscribe("/topic/greetings", (msg: IMessage) => {
        console.log("📩 Message received:", msg.body);
        onMessageReceived(msg.body);
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

export const sendMessage = (msg: string) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination: "/hello", body: msg });
    console.log("📤 Sent message:", msg);
  } else {
    console.warn("⚠️ STOMP client not connected");
  }
};

export const disconnectWebSocket = () => {
  stompClient?.deactivate();
  console.log("❌ Disconnected from WebSocket");
};
