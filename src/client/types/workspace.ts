import { User } from './user.js';

export interface Workspace {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  user: User;
  invited_by?: {
    id: number;
    username: string;
    email: string;
  };
}
