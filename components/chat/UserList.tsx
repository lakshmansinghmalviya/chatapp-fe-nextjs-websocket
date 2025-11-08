'use client';

import { Input, List, Avatar, Badge } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { User } from '@/types/chat';

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

export default function UserList({ users, selectedUser, onUserSelect }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-3">Messages</h2>
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <List
          dataSource={filteredUsers}
          renderItem={(user) => (
            <List.Item
              onClick={() => onUserSelect(user)}
              className={`cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50 ${
                selectedUser?.id === user.id ? 'bg-blue-50' : ''
              }`}
              style={{ border: 'none' }}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot status={user.online ? 'success' : 'default'} offset={[-5, 35]}>
                    <Avatar
                      size={48}
                      style={{
                        backgroundColor: user.online ? '#1890ff' : '#d9d9d9',
                        fontSize: '18px',
                        fontWeight: 600,
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                  </Badge>
                }
                title={
                  <span className="font-medium text-gray-900">{user.name}</span>
                }
                description={
                  <span className="text-sm text-gray-500">
                    {user.online ? 'Online' : 'Offline'}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
