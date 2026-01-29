import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseCarouselComponent, Course } from './course-carousel/course-carousel.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [CourseCarouselComponent, CoursePlayerComponent, HeaderComponent],
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.css'
})
export class AlunoComponent implements OnInit, OnDestroy {
  leadershipCourses: Course[] = [
    {
      id: 'leadership-1',
      title: 'Fundamentos de Liderança',
      description: 'Desenvolva habilidades essenciais para se tornar um líder inspirador e eficaz em sua organização.',
      category: 'Liderança',
      thumbnail: {
        gradient: 'linear-gradient(135deg, #1C2340 0%, #6366F1 100%)',
        emoji: '💼'
      },
      duration: '4h 30min',
      progress: 65
    },
    {
      id: 'leadership-2',
      title: 'Gestão de Equipes Ágeis',
      description: 'Aprenda metodologias ágeis e técnicas modernas para liderar equipes de alto desempenho.',
      category: 'Liderança',
      thumbnail: {
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        emoji: '🎯'
      },
      duration: '3h 15min',
      progress: 30
    }
  ];

  technologyCourses: Course[] = [
    {
      id: 'python-1',
      title: 'Python para Iniciantes',
      description: 'Domine os conceitos fundamentais de programação com Python e crie seus primeiros projetos.',
      category: 'Tecnologia',
      thumbnail: {
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        emoji: '🐍'
      },
      duration: '8h 00min',
      progress: 15
    },
    {
      id: 'complete',
      title: 'Fundamentos de Cloud Computing',
      description: 'Entenda os conceitos essenciais de computação em nuvem e serviços cloud modernos.',
      category: 'Tecnologia',
      thumbnail: {
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        emoji: '☁️'
      },
      duration: '6h 45min',
      progress: 100,
      isCompleted: true
    },
    {
      id: 'security-1',
      title: 'Segurança da Informação',
      description: 'Aprenda práticas essenciais para proteger dados e sistemas contra ameaças digitais.',
      category: 'Tecnologia',
      thumbnail: {
        gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        emoji: '🔒'
      },
      duration: '5h 20min',
      progress: 0
    }
  ];

  complianceCourses: Course[] = [
    {
      id: 'lgpd-1',
      title: 'LGPD na Prática',
      description: 'Compreenda a Lei Geral de Proteção de Dados e como aplicá-la em seu dia a dia profissional.',
      category: 'Compliance',
      thumbnail: {
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        emoji: '📋'
      },
      duration: '2h 30min',
      progress: 45
    }
  ];
  private currentSlide = 1;
  private readonly totalSlides = 5;
  private onDocumentClick = (event: MouseEvent) => {
    const dropdown = document.getElementById('user-dropdown-menu');
    const userSection = document.querySelector('.header-user');
    const target = event.target as HTMLElement | null;
    if (dropdown && userSection && !userSection.contains(target)) {
      dropdown.classList.remove('active');
    }
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const win = window as unknown as Record<string, any>;

    win["openCourse"] = (courseId: string) => {
      if (courseId === 'complete') {
        document.getElementById('certificate-view')?.classList.add('active');
        return;
      }

      this.currentSlide = 1;
      document.getElementById('course-player')?.classList.add('active');
      this.updateSlideDisplay();
      document.body.style.overflow = 'hidden';
    };

    win["closeCourse"] = () => {
      document.getElementById('course-player')?.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    win["closeCertificate"] = () => {
      document.getElementById('certificate-view')?.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    win["nextSlide"] = () => {
      if (this.currentSlide < this.totalSlides) {
        this.currentSlide += 1;
        this.updateSlideDisplay();
      }
    };

    win["previousSlide"] = () => {
      if (this.currentSlide > 1) {
        this.currentSlide -= 1;
        this.updateSlideDisplay();
      }
    };

    win["selectQuizOption"] = (element: HTMLElement, isCorrect: boolean) => {
      const options = element.parentElement?.querySelectorAll('.quiz-option') ?? [];
      const feedback = document.getElementById('quiz-feedback');

      options.forEach((opt) => {
        (opt as HTMLElement).style.pointerEvents = 'none';
      });

      element.classList.add('selected');

      setTimeout(() => {
        if (!feedback) return;

        if (isCorrect) {
          element.classList.add('correct');
          feedback.classList.add('correct');
          feedback.querySelector('.feedback-icon')!.textContent = '✓';
          feedback.querySelector('.feedback-title')!.textContent = 'Correto!';
          feedback.querySelector('.feedback-message')!.textContent =
            'Um líder eficaz inspira e capacita sua equipe, criando um ambiente colaborativo onde todos podem contribuir para o sucesso coletivo.';
        } else {
          element.classList.add('incorrect');
          feedback.classList.add('incorrect');
          feedback.querySelector('.feedback-icon')!.textContent = '✕';
          feedback.querySelector('.feedback-title')!.textContent = 'Incorreto';
          feedback.querySelector('.feedback-message')!.textContent =
            'A liderança eficaz vai além da autoridade. Tente novamente após revisar o conteúdo.';
        }

        feedback.classList.add('show');
      }, 300);
    };

    win["toggleUserDropdown"] = () => {
      const dropdown = document.getElementById('user-dropdown-menu');
      dropdown?.classList.toggle('active');
    };

    win["logout"] = () => {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login-aluno']);
    };

    document.addEventListener('click', this.onDocumentClick);

    setTimeout(() => this.updateSlideDisplay(), 0);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick);
  }

  private updateSlideDisplay(): void {
    document.querySelectorAll('.slide').forEach((slide, index) => {
      slide.classList.remove('active');
      if (index + 1 === this.currentSlide) {
        slide.classList.add('active');
      }
    });

    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
      dot.classList.remove('active');
      if (index + 1 === this.currentSlide) {
        dot.classList.add('active');
      }
    });

    const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement | null;
    const nextBtn = document.getElementById('next-btn') as HTMLButtonElement | null;

    if (prevBtn) {
      prevBtn.disabled = this.currentSlide === 1;
    }

    if (nextBtn) {
      nextBtn.textContent = this.currentSlide === this.totalSlides ? '✓ Concluir' : 'Próximo →';
    }

    const progress = Math.round((this.currentSlide / this.totalSlides) * 100);
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
      progressCircle.setAttribute('data-progress', progress.toString());
      const degrees = (progress / 100) * 360;
      (progressCircle as HTMLElement).style.background =
        `conic-gradient(#1C2340 ${degrees}deg, #E5E9F0 ${degrees}deg)`;
    }

    const currentSlideNumber = document.getElementById('current-slide-number');
    const totalSlides = document.getElementById('total-slides');
    if (currentSlideNumber) currentSlideNumber.textContent = `${this.currentSlide}`;
    if (totalSlides) totalSlides.textContent = `${this.totalSlides}`;
  }
}
