import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aluno',
  standalone: true,
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AlunoComponent implements OnInit, OnDestroy {
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
