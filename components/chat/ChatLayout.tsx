'use client';

import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { User, Message } from '@/types/chat';
import { connectWebSocket, disconnectWebSocket, sendMessage } from '@/lib/socket';
import { Client, over, Message as SocketMessage } from "stompjs";

const { Sider, Content } = Layout;

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const mockUsers: User[] = [
    { id: '1', name: 'Alice Johnson', avatar: 'AJ', online: true },
    { id: '2', name: 'Bob Smith', avatar: 'BS', online: true },
    { id: '3', name: 'Carol White', avatar: 'CW', online: false },
    { id: '4', name: 'David Brown', avatar: 'DB', online: true },
  ];

  const mockMessages: Record<string, Message[]> = {
    '1': [
      { id: '1', senderId: '1', text: 'Hey! How are you?', timestamp: new Date(Date.now() - 3600000), isOwn: false },
      { id: '2', senderId: 'me', text: 'I\'m good, thanks! How about you?', timestamp: new Date(Date.now() - 3500000), isOwn: true },
      { id: '3', senderId: '1', text: 'Doing great! Working on a new project.', timestamp: new Date(Date.now() - 3400000), isOwn: false },
    ],
    '2': [
      { id: '4', senderId: '2', text: 'Did you see the game last night?', timestamp: new Date(Date.now() - 7200000), isOwn: false },
      { id: '5', senderId: 'me', text: 'Yes! It was incredible!', timestamp: new Date(Date.now() - 7100000), isOwn: true },
    ],
    '3': [
      { id: '6', senderId: '3', text: 'Can we reschedule our meeting?', timestamp: new Date(Date.now() - 86400000), isOwn: false },
    ],
    '4': [
      { id: '7', senderId: '4', text: 'The document is ready for review', timestamp: new Date(Date.now() - 1800000), isOwn: false },
      { id: '8', senderId: 'me', text: 'Thanks! I\'ll check it out.', timestamp: new Date(Date.now() - 1700000), isOwn: true },
    ],
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setMessages(mockMessages[user.id] || []);
  };

  const handleSendMessage = (text: string) => {
    if (!selectedUser) return;
    sendMessage(text);
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
  };


  useEffect(() => {
    // Connect on mount
    connectWebSocket((msg) => {
      setMessages((prev: Message[]) => [...prev,
      {
        id: Date.now().toString(),
        senderId: 'me',
        msg,
        timestamp: new Date(),
        isOwn: true,
      }]);
    });

    // Disconnect on unmount
    return () => disconnectWebSocket();
  }, []);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        width={320}
        style={{
          background: '#fff',
          borderRight: '1px solid #e8e8e8',
        }}
      >
        <UserList
          users={mockUsers}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
        />
      </Sider>
      <Content>
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </Content>
    </Layout>
  );
}
