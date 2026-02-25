import { User } from './user.response';

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  data: User;
}
