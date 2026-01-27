import { Routes } from '@angular/router';
import { AlunoComponent } from './features/aluno/aluno.component';
import { BackofficeComponent } from './features/backoffice/backoffice.component';
import { LoginAlunoComponent } from './features/login-aluno/login-aluno.component';
import { LoginGestaoComponent } from './features/login-gestao/login-gestao.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login-gestao' },
	{ path: 'login-gestao', component: LoginGestaoComponent },
	{ path: 'login-aluno', component: LoginAlunoComponent },
	{ path: 'backoffice', component: BackofficeComponent },
	{ path: 'aluno', component: AlunoComponent },
	{ path: '**', redirectTo: 'login-gestao' }
];
