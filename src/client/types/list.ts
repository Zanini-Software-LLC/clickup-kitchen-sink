import { Status, Priority } from './common.js';
import { User } from './user.js';

export interface List {
  id: string;
  name: string;
  orderindex: number;
  content: string;
  status: Status | null;
  priority: Priority | null;
  assignee: User | null;
  task_count: number;
  due_date: string | null;
  start_date: string | null;
  folder: {
    id: string;
    name: string;
    hidden: boolean;
  };
  space: {
    id: string;
    name: string;
  };
  archived: boolean;
  override_statuses: boolean;
  statuses: Status[];
  permission_level: string;
}
