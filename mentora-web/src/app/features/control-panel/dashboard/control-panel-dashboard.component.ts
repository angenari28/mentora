import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StatItem, StatsGridComponent } from '@components/stats/stats-grid.component';
import { DashboardService } from '@services/dashboard.service';
import { WorkspaceService } from '@services/workspace.service';

@Component({
  selector: 'app-control-panel-dashboard',
  standalone: true,
  imports: [CommonModule, StatsGridComponent],
  templateUrl: './control-panel-dashboard.component.html',
  styleUrls: ['./control-panel-dashboard.component.css']
})
export class ControlPanelDashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly workspaceService = inject(WorkspaceService);

  loading = true;

  stats: StatItem[] = [
    { icon: '👥', trend: '—', trendDirection: 'up', label: 'Usuários Ativos', value: '—', footer: 'Carregando...' },
    { icon: '📖', trend: '—', trendDirection: 'up', label: 'Cursos Ativos', value: '—', footer: 'Carregando...' },
    { icon: '📚', trend: '—', trendDirection: 'up', label: 'Turmas Ativas', value: '—', footer: 'Carregando...' },
    { icon: '📗', trend: '—', trendDirection: 'up', label: 'Turmas Concluídas', value: '—', footer: 'Carregando...' },
  ];

  activities: { icon: string; title: string; description: string; time: string }[] = [];

  ngOnInit(): void {
    const workspaceId = this.workspaceService.getCurrentWorkspaceId();
    if (!workspaceId) return;

    this.dashboardService.getDashboard(workspaceId).subscribe({
      next: ({ data }) => {
        this.stats = [
          {
            icon: '👥',
            trend: '—',
            trendDirection: 'up',
            label: 'Usuários Ativos',
            value: data.activeUsers.toLocaleString('pt-BR'),
            footer: `Total de usuários ativos`
          },
          {
            icon: '📖',
            trend: '—',
            trendDirection: 'up',
            label: 'Cursos Ativos',
            value: data.activeCourses.toLocaleString('pt-BR'),
            footer: `Total de cursos ativos`
          },
          {
            icon: '📚',
            trend: '—',
            trendDirection: 'up',
            label: 'Turmas Ativas',
            value: data.activeClasses.toLocaleString('pt-BR'),
            footer: `Total de turmas ativas`
          },
          {
            icon: '📗',
            trend: '—',
            trendDirection: 'up',
            label: 'Turmas Concluídas',
            value: data.completedClasses.toLocaleString('pt-BR'),
            footer: `Turmas com data de encerramento passada`
          },
        ];

        this.activities = data.recentActivities.map(a => ({
          icon: '👤',
          title: 'Novo usuário registrado',
          description: `${a.userName} criou uma conta`,
          time: this.timeAgo(a.createdAt)
        }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private timeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `há ${days} dia${days > 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    return `há ${months} mês${months > 1 ? 'es' : ''}`;
  }
}
