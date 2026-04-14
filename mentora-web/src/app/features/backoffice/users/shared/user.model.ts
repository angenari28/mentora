import { signal } from '@angular/core';

export interface IUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  workspaceId: string;
  isActive: boolean;
}

export const userModel = signal<IUser>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Student',
  workspaceId: '',
  isActive: true,
});
