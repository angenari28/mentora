import { ListItem } from './shared/list-item.response';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  workspace?: { id: string; name: string };
}
