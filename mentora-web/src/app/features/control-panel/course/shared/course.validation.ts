import { disabled, maxLength, required, SchemaFn } from '@angular/forms/signals';

import { ICourse } from './course.model';

const validateForm: SchemaFn<ICourse> = (course) => {
  required(course.name, { message: 'O campo Nome é obrigatório.' });
  maxLength(course.name, 100);
  required(course.categoryId, { message: 'O campo Categoria é obrigatório.' });
  required(course.workloadHours, { message: 'O campo Duração é obrigatório.' });
};

const readonlyForm: SchemaFn<ICourse> = (course) => {
      disabled(course.name);
      disabled(course.showCertificate);
      disabled(course.workloadHours);
      disabled(course.categoryId);
      disabled(course.active);
    };

export { validateForm as validate, readonlyForm as readonly };
