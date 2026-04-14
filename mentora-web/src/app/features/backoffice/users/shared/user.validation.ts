import { maxLength, minLength, required, SchemaFn } from '@angular/forms/signals';
import { IUser } from './user.model';

export const createValidate: SchemaFn<IUser> = (s) => {
  required(s.name, { message: 'O campo Nome é obrigatório.' });
  maxLength(s.name, 100);
  required(s.email, { message: 'O campo E-mail é obrigatório.' });
  maxLength(s.email, 255);
  required(s.password, { message: 'O campo Senha é obrigatório.' });
  minLength(s.password, 6, { message: 'A senha deve ter no mínimo 6 caracteres.' });
  required(s.confirmPassword, { message: 'A confirmação de senha é obrigatória.' });
  required(s.role, { message: 'O campo Função é obrigatório.' });
  required(s.workspaceId, { message: 'O campo Workspace é obrigatório.' });
};

export const editValidate: SchemaFn<IUser> = (s) => {
  required(s.name, { message: 'O campo Nome é obrigatório.' });
  maxLength(s.name, 100);
  required(s.email, { message: 'O campo E-mail é obrigatório.' });
  maxLength(s.email, 255);
  maxLength(s.password, 255);
  required(s.role, { message: 'O campo Função é obrigatório.' });
  required(s.workspaceId, { message: 'O campo Workspace é obrigatório.' });
};
