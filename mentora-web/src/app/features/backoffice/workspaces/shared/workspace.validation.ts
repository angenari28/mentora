import { maxLength, required, SchemaFn } from '@angular/forms/signals';
import { IWorkspace } from './workspace.model';

export const createValidate: SchemaFn<IWorkspace> = (s) => {
  required(s.name, { message: 'O campo Nome é obrigatório.' });
  maxLength(s.name, 100);
  required(s.url, { message: 'O campo URL é obrigatório.' });
  maxLength(s.url, 255);
};

export const editValidate: SchemaFn<IWorkspace> = (s) => {
  required(s.name, { message: 'O campo Nome é obrigatório.' });
  maxLength(s.name, 100);
  required(s.url, { message: 'O campo URL é obrigatório.' });
  maxLength(s.url, 255);
};
