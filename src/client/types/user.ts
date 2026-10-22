/**
 * User type definitions for ClickUp API v2
 */

export interface User {
  id: number;
  username: string;
  email: string;
  color: string;
  profilePicture: string | null;
  initials: string;
  week_start_day: number;
  global_font_support: boolean;
  timezone: string;
}
