import { signal } from '@angular/core';

export interface IWorkspace {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  bigBanner: string;
  smallBanner: string;
  active: boolean;
  url: string;
}

export const workspaceModel = signal<IWorkspace>({
  name: '',
  logo: '',
  primaryColor: '#1C2340',
  secondaryColor: '#4A6CF7',
  bigBanner: '',
  smallBanner: '',
  active: true,
  url: '',
});
