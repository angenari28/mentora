import { Routes } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsScreenComponent } from './details-screen/details-screen.component';
import { UserCreateComponent } from './users/create/user-create.component';
import { UsersComponent } from './users/users.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { backofficeGuard } from '../../guards/backoffice.guard';

export const BACKOFFICE_ROUTES: Routes = [
  {
    path: 'backoffice',
    component: BackofficeComponent,
    canActivate: [backofficeGuard],
    children: [
      { path: '', pathMatch: 'full', component: DashboardComponent },
      { path: 'users', pathMatch: 'full', component: UsersComponent },
      { path: 'users/create', component: UserCreateComponent },
      { path: 'details', component: DetailsScreenComponent },
      { path: 'workspaces', component: WorkspacesComponent },
    ],
  },
];
