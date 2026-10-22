/**
 * Custom Field type definitions for ClickUp API v2
 */

export interface CustomField {
  id: string;
  name: string;
  type:
    | 'text'
    | 'number'
    | 'currency'
    | 'date'
    | 'drop_down'
    | 'checkbox'
    | 'url'
    | 'email'
    | 'phone'
    | 'labels'
    | 'users'
    | 'location'
    | 'rating';
  type_config: CustomFieldTypeConfig;
  date_created: string;
  hide_from_guests: boolean;
  required: boolean;
}

export interface CustomFieldTypeConfig {
  default?: number;
  placeholder?: string;
  options?: CustomFieldOption[];
  new_drop_down?: boolean;
}

export interface CustomFieldOption {
  id: string;
  name: string;
  color: string | null;
  orderindex: number;
}

export interface CustomFieldValue {
  id: string;
  name: string;
  type: string;
  type_config: CustomFieldTypeConfig;
  date_created: string;
  hide_from_guests: boolean;
  value: string | number | boolean | CustomFieldOption | null;
}
