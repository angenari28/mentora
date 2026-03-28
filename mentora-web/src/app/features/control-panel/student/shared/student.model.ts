import { signal, Signal, WritableSignal } from '@angular/core';

export interface IStudent {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

export const studentModel = signal<IStudent>({
  name: '',
  email: '',
  password: '',
  isActive: true,
});

export interface IFormReadonly {
  readonly: WritableSignal<boolean>;
}

export interface IStudentCourseReset {
  showCourseReset: Signal<boolean>;
  studentCourses: Signal<{ id: string; name: string }[]>;
  selectedCourseId: WritableSignal<string>;
  resettingCourse: Signal<boolean>;
  resetCourseSlideTime(): void;
}
