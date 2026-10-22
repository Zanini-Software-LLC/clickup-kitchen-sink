/**
 * Comment type definitions for ClickUp API v2
 */

import { User } from './user.js';

export interface Comment {
  id: string;
  comment: CommentContent[];
  comment_text: string;
  user: User;
  date: string;
  resolved: boolean;
  assignee: User | null;
  assigned_by: User | null;
  reactions: Reaction[];
}

export interface CommentContent {
  text: string;
  type?: 'mention' | 'link';
  attributes?: {
    id?: string;
    url?: string;
  };
}

export interface Reaction {
  reaction: string;
  user: User;
}
