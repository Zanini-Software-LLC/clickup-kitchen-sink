/**
 * View type definitions for ClickUp API v2
 */

export interface View {
  id: string;
  name: string;
  type: 'list' | 'board' | 'calendar' | 'gantt' | 'timeline' | 'workload' | 'activity' | 'map' | 'table' | 'box' | 'doc' | 'embed' | 'form';
  parent: {
    id: string;
    type: number;
  };
  grouping: {
    field: string | null;
    dir: number | null;
    collapsed: string[];
    ignore: boolean;
  };
  divide: {
    field: string | null;
    dir: number | null;
    collapsed: string[];
  } | null;
  sorting: {
    fields: Array<{
      field: string;
      dir: number;
    }>;
  } | null;
  filters: {
    op: 'AND' | 'OR';
    fields: Array<{
      field: string;
      operator: string;
      value: unknown;
    }>;
    search: string | null;
    search_fields: string[];
    show_closed: boolean;
  };
  columns: {
    fields: Array<{
      field: string;
      idx: number;
      hidden: boolean;
    }>;
  } | null;
  team_sidebar: {
    assignees: number[];
    assigned_comments: boolean;
    unassigned_tasks: boolean;
  } | null;
  settings: {
    show_task_locations: boolean;
    show_subtasks: number;
    show_subtask_parent_names: boolean;
    show_closed_subtasks: boolean;
    show_assignees: boolean;
    show_images: boolean;
    collapse_empty_columns: boolean | null;
    me_comments: boolean;
    me_subtasks: boolean;
    me_checklists: boolean;
  };
  date_created: string;
  creator: number;
  visibility: 'private' | 'public';
  protected: boolean;
}
