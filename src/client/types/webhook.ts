/**
 * Webhook type definitions for ClickUp API v2
 */

export type WebhookEvent =
  | 'taskCreated'
  | 'taskUpdated'
  | 'taskDeleted'
  | 'taskPriorityUpdated'
  | 'taskStatusUpdated'
  | 'taskAssigneeUpdated'
  | 'taskDueDateUpdated'
  | 'taskTagUpdated'
  | 'taskMoved'
  | 'taskCommentPosted'
  | 'taskCommentUpdated'
  | 'taskTimeEstimateUpdated'
  | 'taskTimeTrackedUpdated'
  | 'listCreated'
  | 'listUpdated'
  | 'listDeleted'
  | 'folderCreated'
  | 'folderUpdated'
  | 'folderDeleted'
  | 'spaceCreated'
  | 'spaceUpdated'
  | 'spaceDeleted'
  | 'goalCreated'
  | 'goalUpdated'
  | 'goalDeleted';

export interface Webhook {
  id: string;
  userid: number;
  team_id: string;
  endpoint: string;
  events: WebhookEvent[];
  task_id: string | null;
  list_id: string | null;
  folder_id: string | null;
  space_id: string | null;
  health: {
    status: 'active' | 'failing';
    fail_count: number;
  };
  secret: string;
}
