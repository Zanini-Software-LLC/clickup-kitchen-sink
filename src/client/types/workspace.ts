import { User } from './user.js';

export interface Workspace {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: Member[];
}

export interface Member {
  user: User;
  invited_by?: {
    id: number;
    username: string;
    email: string;
  };
}
