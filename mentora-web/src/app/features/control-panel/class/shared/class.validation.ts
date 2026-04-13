import { disabled, maxLength, required, SchemaFn } from '@angular/forms/signals';
import { IClass } from './class.model';

const validateForm: SchemaFn<IClass> = (schema) => {
  required(schema.courseId, { message: 'Selecione um curso.' });
  required(schema.name, { message: 'O campo Nome é obrigatório.' });
  maxLength(schema.name, 100);
  required(schema.dateStart, { message: 'A data de início é obrigatória.' });
  required(schema.dateEnd, { message: 'A data de término é obrigatória.' });
};

const readonlyForm: SchemaFn<IClass> = (schema) => {
  disabled(schema.courseId);
  disabled(schema.name);
  disabled(schema.dateStart);
  disabled(schema.dateEnd);
  disabled(schema.active);
};

export { validateForm as validate, readonlyForm as readonly };
