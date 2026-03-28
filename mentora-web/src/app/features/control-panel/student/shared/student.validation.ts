import { disabled, maxLength, minLength, required, SchemaFn } from '@angular/forms/signals';

import { IStudent } from './student.model';

const validateForm: SchemaFn<IStudent> = (student) => {
  required(student.name, { message: 'O campo Nome é obrigatório.' });
  maxLength(student.name, 100);
  required(student.email, { message: 'O campo E-mail é obrigatório.' });
  maxLength(student.email, 200);
  required(student.password, { message: 'O campo Senha é obrigatório.' });
  minLength(student.password, 6, { message: 'A senha deve ter no mínimo 6 caracteres.' });
};

const validateUpdateForm: SchemaFn<IStudent> = (student) => {
  required(student.name, { message: 'O campo Nome é obrigatório.' });
  maxLength(student.name, 100);
  required(student.email, { message: 'O campo E-mail é obrigatório.' });
  maxLength(student.email, 200);
};

const readonlyForm: SchemaFn<IStudent> = (student) => {
  disabled(student.name);
  disabled(student.email);
  disabled(student.password);
  disabled(student.isActive);
};

export { validateForm as validate, validateUpdateForm as validateUpdate, readonlyForm as readonly };
