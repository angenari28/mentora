import { Routes } from '@angular/router';
import { StudentComponent } from './features/student/student.component';
import { LoginStudentComponent } from './features/login-student/login-student.component';
import { LoginComponent } from './features/login/login.component';
import { CONTROL_PANEL_ROUTES } from './features/control-panel/control-panel.routes';
import { BACKOFFICE_ROUTES } from './features/backoffice/backoffice.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login-student' },
  { path: 'login', component: LoginComponent },
  { path: 'login-student', component: LoginStudentComponent },
  ...BACKOFFICE_ROUTES,
  ...CONTROL_PANEL_ROUTES,
  { path: 'student/:id', component: StudentComponent },
  { path: '**', redirectTo: 'login' },
];
