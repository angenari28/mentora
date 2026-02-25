export interface Workspace {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  bigBanner: string;
  smallBanner: string;
  active: boolean;
  url: string;
  createdAt: string;
  updatedAt?: string;
}
