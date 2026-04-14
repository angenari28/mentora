import { Routes } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsScreenComponent } from './details-screen/details-screen.component';
import { UserCreateComponent } from './users/create/user-create.component';
import { UserEditComponent } from './users/edit/user-edit.component';
import { UsersComponent } from './users/users.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { WorkspaceCreateComponent } from './workspaces/create/workspace-create.component';
import { WorkspaceEditComponent } from './workspaces/edit/workspace-edit.component';
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
      { path: 'users/edit/:id', component: UserEditComponent },
      { path: 'details', component: DetailsScreenComponent },
      { path: 'workspaces', pathMatch: 'full', component: WorkspacesComponent },
      { path: 'workspaces/create', component: WorkspaceCreateComponent },
      { path: 'workspaces/edit/:id', component: WorkspaceEditComponent },
    ],
  },
];
