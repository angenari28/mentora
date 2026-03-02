import { Routes } from '@angular/router';
import { AlunoComponent } from './features/aluno/aluno.component';
import { BackofficeComponent } from './features/backoffice/backoffice.component';
import { DashboardComponent } from './features/backoffice/dashboard/dashboard.component';
import { UsersComponent } from './features/backoffice/users/users.component';
import { DetailsScreenComponent } from './features/backoffice/details-screen/details-screen.component';
import { WorkspacesComponent } from './features/backoffice/workspaces/workspaces.component';
import { LoginAlunoComponent } from './features/login-aluno/login-aluno.component';
import { LoginGestaoComponent } from './features/login-gestao/login-gestao.component';
import { CONTROL_PANEL_ROUTES } from './features/control-panel/control-panel.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login-aluno' },
  { path: 'login-gestao', component: LoginGestaoComponent },
  { path: 'login-aluno', component: LoginAlunoComponent },
  {
    path: 'backoffice',
    component: BackofficeComponent,
    children: [
      { path: '', pathMatch: 'full', component: DashboardComponent },
      { path: 'usuarios', component: UsersComponent },
      { path: 'detalhes', component: DetailsScreenComponent },
      { path: 'workspaces', component: WorkspacesComponent },
    ],
  },
  ...CONTROL_PANEL_ROUTES,
  { path: 'aluno', component: AlunoComponent },
  { path: '**', redirectTo: 'login-gestao' },
];
