import { Component } from '@angular/core';
import { StatItem, StatsGridComponent } from './shared/stats-grid/stats-grid.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsGridComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  courseCompletionChart = [
    { name: 'Fundamentos de Mentoria', completion: 78 },
    { name: 'Comunicação Estratégica', completion: 64 },
    { name: 'Liderança Prática', completion: 91 }
  ];

  stats: StatItem[] = [
    {
      icon: '👥',
      trend: '↑ 12.5%',
      trendDirection: 'up',
      label: 'Usuários Ativos',
      value: '2,847',
      footer: '+324 novos usuários este mês'
    },
    {
      icon: '📖',
      trend: '↑ 8.2%',
      trendDirection: 'up',
      label: 'Cursos Ativos',
      value: '128',
      footer: '+12 cursos este mês'
    },
    {
      icon: '📚',
      trend: '↓ 3.1%',
      trendDirection: 'down',
      label: 'Turmas Ativas',
      value: '1,249',
      footer: '387 turmas ativas este mês'
    },
    {
      icon: '📗',
      trend: '↑ 15.3%',
      trendDirection: 'up',
      label: 'Cursos concluídos',
      value: '30%',
      footer: 'Acima da média mensal'
    }
  ];

  openModal(): void {
    document.getElementById('demo-modal')?.classList.add('active');
  }
}
