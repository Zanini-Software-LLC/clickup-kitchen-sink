import { Status } from './common.js';

export interface Space {
  id: string;
  name: string;
  color: string | null;
  private: boolean;
  avatar: string | null;
  admin_can_manage: boolean;
  statuses: Status[];
  multiple_assignees: boolean;
  features: SpaceFeatures;
}

export interface SpaceFeatures {
  due_dates: {
    enabled: boolean;
    start_date: boolean;
    remap_due_dates: boolean;
    remap_closed_due_date: boolean;
  };
  sprints: { enabled: boolean };
  time_tracking: { enabled: boolean };
  points: { enabled: boolean };
  custom_fields: { enabled: boolean };
  checklists: { enabled: boolean };
  zoom: { enabled: boolean };
  milestones: { enabled: boolean };
}
