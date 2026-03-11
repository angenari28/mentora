export interface LoginRequest {
  email: string;
  password: string;
  role: LoginAllowedRoles;
}

export enum LoginAllowedRoles {
  None = 0,
  Student = 1,
  Administrator = 2,
  Master = 4,
  Management = Administrator | Master,
}
