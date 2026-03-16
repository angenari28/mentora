import { signal, WritableSignal } from '@angular/core';
import { required, maxLength, SchemaFn } from '@angular/forms/signals';

export interface ICourse {
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
