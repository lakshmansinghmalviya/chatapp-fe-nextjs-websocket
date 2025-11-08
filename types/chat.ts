export interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export interface Message {
  id?: string;
  senderId?: string;
  text?: string;
  timestamp?: Date;
  isOwn?: boolean;
}
