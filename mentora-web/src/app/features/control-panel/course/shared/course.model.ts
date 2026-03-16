import { signal, WritableSignal } from '@angular/core';

interface ICourse {
  name: string;
  categoryId: string;
  workloadHours: number;
  active: boolean;
  showCertificate: boolean;
}

export const courseModel = signal<ICourse>({
    name: '',
    categoryId: '',
    workloadHours: 0,
    active: true,
    showCertificate: true
  });

  export interface IFormReadonly {
    readonly: WritableSignal<boolean>;
  }
