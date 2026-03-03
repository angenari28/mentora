import { Routes } from '@angular/router';
import { AlunoComponent } from './features/aluno/aluno.component';
import { LoginAlunoComponent } from './features/login-aluno/login-aluno.component';
import { LoginGestaoComponent } from './features/login-gestao/login-gestao.component';
import { CONTROL_PANEL_ROUTES } from './features/control-panel/control-panel.routes';
import { BACKOFFICE_ROUTES } from './features/backoffice/backoffice.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login-aluno' },
  { path: 'login-gestao', component: LoginGestaoComponent },
  { path: 'login-aluno', component: LoginAlunoComponent },
  ...BACKOFFICE_ROUTES,
  ...CONTROL_PANEL_ROUTES,
  { path: 'aluno', component: AlunoComponent },
  { path: '**', redirectTo: 'login-gestao' },
];
