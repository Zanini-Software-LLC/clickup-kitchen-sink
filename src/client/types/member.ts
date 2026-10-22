/**
 * Member type definitions for ClickUp API v2
 */

import { User } from './user.js';

export interface Member {
  user: User;
  invited_by: User | null;
}
