/**
 * Time Entry type definitions for ClickUp API v2
 */

import { User } from './user.js';

export interface TimeEntry {
  id: string;
  task: {
    id: string;
    name: string;
    status: {
      status: string;
      color: string;
      type: string;
      orderindex: number;
    };
    custom_type?: string;
  } | null;
  wid: string;
  user: User;
  billable: boolean;
  start: string;
  end: string;
  duration: string;
  description: string;
  tags: Array<{
    name: string;
    tag_fg: string;
    tag_bg: string;
  }>;
  source: string;
  at: string;
}
