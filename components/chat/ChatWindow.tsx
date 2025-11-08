'use client';

import { useState, useEffect, useRef } from 'react';
import { Input, Button, Avatar, Empty } from 'antd';
import { SendOutlined, SmileOutlined } from '@ant-design/icons';
import { User, Message } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';

const { TextArea } = Input;

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export default function ChatWindow({ selectedUser, messages, onSendMessage }: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <Empty
          description="Select a user to start chatting"
          className="text-gray-400"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center shadow-sm">
        <Avatar
          size={40}
          style={{
            backgroundColor: selectedUser.online ? '#1890ff' : '#d9d9d9',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          {selectedUser.avatar}
        </Avatar>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
          <p className="text-sm text-gray-500">
            {selectedUser.online ? 'Active now' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md ${
                  message.isOwn ? 'order-2' : 'order-1'
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <p
                  className={`text-xs text-gray-400 mt-1 px-2 ${
                    message.isOwn ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-end space-x-3">
          <Button
            type="text"
            icon={<SmileOutlined className="text-xl" />}
            className="flex items-center justify-center"
          />
          <TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1 rounded-xl"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="h-10 rounded-xl"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
