import { ListItem } from './shared/list-item.response';
import { User } from './user.response';

export interface UserListResponse {
  success: boolean;
  message: string;
  data: ListItem<User>;
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  data: User;
}



