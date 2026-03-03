import { Routes } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsScreenComponent } from './details-screen/details-screen.component';
import { UserCreateComponent } from './users/create/user-create.component';
import { UsersComponent } from './users/users.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';

export const BACKOFFICE_ROUTES: Routes = [
  {
    path: 'backoffice',
    component: BackofficeComponent,
    children: [
      { path: '', pathMatch: 'full', component: DashboardComponent },
      { path: 'usuarios', pathMatch: 'full', component: UsersComponent },
      { path: 'usuarios/create', component: UserCreateComponent },
      { path: 'detalhes', component: DetailsScreenComponent },
      { path: 'workspaces', component: WorkspacesComponent },
    ],
  },
];
