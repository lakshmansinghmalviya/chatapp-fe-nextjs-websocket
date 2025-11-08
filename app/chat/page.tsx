'use client';

import ChatLayout from '@/components/chat/ChatLayout';
import { connectWebSocket, disconnectWebSocket } from '@/lib/socket';
import { useEffect } from 'react';

export default function ChatPage() {
  return <ChatLayout />;
}
