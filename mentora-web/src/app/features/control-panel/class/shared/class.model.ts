import { signal, WritableSignal } from '@angular/core';

export interface IClass {
  courseId: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  active: boolean;
}

export const classModel = signal<IClass>({
  courseId: '',
  name: '',
  dateStart: '',
  dateEnd: '',
  active: true,
});

export interface IFormReadonly {
  readonly: WritableSignal<boolean>;
}
