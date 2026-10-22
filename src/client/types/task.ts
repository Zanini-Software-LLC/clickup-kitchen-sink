import { Status, Priority } from './common.js';
import { User } from './user.js';

export interface Task {
  id: string;
  custom_id: string | null;
  name: string;
  text_content: string;
  description: string;
  status: Status;
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  creator: User;
  assignees: User[];
  watchers: User[];
  checklists: Checklist[];
  tags: Tag[];
  parent: string | null;
  priority: Priority | null;
  due_date: string | null;
  start_date: string | null;
  points: number | null;
  time_estimate: number | null;
  custom_fields: CustomFieldValue[];
  dependencies: Dependency[];
  linked_tasks: LinkedTask[];
  team_id: string;
  url: string;
  permission_level: string;
  list: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  folder: {
    id: string;
    name: string;
  };
  space: {
    id: string;
  };
}

export interface Tag {
  name: string;
  tag_fg: string;
  tag_bg: string;
  creator: number;
}

export interface LinkedTask {
  task_id: string;
  link_id: string;
  date_created: string;
  userid: string;
}

export interface Dependency {
  task_id: string;
  depends_on: string;
  type: 'waiting_on' | 'blocking';
  date_created: string;
  userid: string;
}

export interface Checklist {
  id: string;
  task_id: string;
  name: string;
  orderindex: number;
  resolved: number;
  unresolved: number;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  name: string;
  orderindex: number;
  assignee: User | null;
  resolved: boolean;
  parent: string | null;
  date_created: string;
  children: ChecklistItem[];
}

export interface CustomFieldValue {
  id: string;
  name: string;
  type: string;
  type_config: any;
  date_created: string;
  hide_from_guests: boolean;
  value: string | number | boolean | any | null;
}
