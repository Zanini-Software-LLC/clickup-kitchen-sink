/**
 * Goal type definitions for ClickUp API v2
 */

import { User } from './user.js';

export interface Goal {
  id: string;
  name: string;
  team_id: string;
  date_created: string;
  start_date: string | null;
  due_date: string | null;
  description: string;
  private: boolean;
  archived: boolean;
  creator: number;
  color: string;
  pretty_id: string;
  multiple_owners: boolean;
  folder_id: string | null;
  members: User[];
  owners: User[];
  key_results: KeyResult[];
  percent_completed: number;
  history: Array<{
    user: User;
    event: string;
    event_description: string;
    date: string;
  }>;
  pretty_url: string;
}

export interface KeyResult {
  id: string;
  goal_id: string;
  name: string;
  creator: number;
  type: 'number' | 'currency' | 'boolean' | 'percentage' | 'automatic';
  unit: string | null;
  steps_start: number;
  steps_end: number;
  steps_current: number;
  completed: boolean;
  task_ids: string[];
  list_ids: string[];
  subcategory_ids: string[];
  percentage_completed: number;
  owners: User[];
  last_action: string;
}
