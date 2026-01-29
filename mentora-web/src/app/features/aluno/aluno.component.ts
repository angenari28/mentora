import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-aluno',
  standalone: true,
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.css'
})
export class AlunoComponent implements OnInit, OnDestroy {
  private currentSlide = 1;
  private readonly totalSlides = 5;

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
        this.currentSlide++;
        this.updateSlideDisplay();
      }
    };

    win["previousSlide"] = () => {
      if (this.currentSlide > 1) {
        this.currentSlide--;
        this.updateSlideDisplay();
      }
    };

    win["selectQuizOption"] = (element: HTMLElement, isCorrect: boolean) => {
      const options = element.parentElement?.querySelectorAll('.quiz-option');
      const feedback = document.getElementById('quiz-feedback');

      options?.forEach(opt => {
        (opt as HTMLElement).style.pointerEvents = 'none';
      });

      element.classList.add('selected');

      setTimeout(() => {
        if (isCorrect) {
          element.classList.add('correct');
          feedback?.classList.add('correct');
          if (feedback) {
            feedback.querySelector('.feedback-icon')!.textContent = '✓';
            feedback.querySelector('.feedback-title')!.textContent = 'Correto!';
            feedback.querySelector('.feedback-message')!.textContent = 'Um líder eficaz inspira e capacita sua equipe, criando um ambiente colaborativo onde todos podem contribuir para o sucesso coletivo.';
          }
        } else {
          element.classList.add('incorrect');
          feedback?.classList.add('incorrect');
          if (feedback) {
            feedback.querySelector('.feedback-icon')!.textContent = '✕';
            feedback.querySelector('.feedback-title')!.textContent = 'Incorreto';
            feedback.querySelector('.feedback-message')!.textContent = 'A liderança eficaz vai além da autoridade. Tente novamente após revisar o conteúdo.';
          }
        }
        feedback?.classList.add('show');
      }, 300);
    };

    win["toggleUserDropdown"] = () => {
      const dropdown = document.getElementById('user-dropdown-menu');
      dropdown?.classList.toggle('active');
    };

    win["logout"] = () => {
      localStorage.clear();
      sessionStorage.clear();
      // Redirecionar para login
      console.log('Logout clicked');
    };

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (event) => {
      const userSection = document.querySelector('.header-user');
      const menu = document.getElementById('user-dropdown-menu');

      if (menu && !userSection?.contains(event.target as Node)) {
        menu.classList.remove('active');
      }
    });

    // Inicializar progress circle
    this.updateSlideDisplay();
  }

  ngOnDestroy(): void {
    const win = window as unknown as Record<string, any>;
    delete win["openCourse"];
    delete win["closeCourse"];
    delete win["closeCertificate"];
    delete win["nextSlide"];
    delete win["previousSlide"];
    delete win["selectQuizOption"];
    delete win["toggleUserDropdown"];
    delete win["logout"];
    document.body.style.overflow = 'auto';
  }

  private updateSlideDisplay(): void {
    // Update slides
    document.querySelectorAll('.slide').forEach((slide, index) => {
      slide.classList.remove('active');
      if (index + 1 === this.currentSlide) {
        slide.classList.add('active');
      }
    });

    // Update indicators
    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
      dot.classList.remove('active');
      if (index + 1 === this.currentSlide) {
        dot.classList.add('active');
      }
    });

    // Update buttons
    const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;

    if (prevBtn) prevBtn.disabled = this.currentSlide === 1;

    if (nextBtn) {
      if (this.currentSlide === this.totalSlides) {
        nextBtn.textContent = '✓ Concluir';
      } else {
        nextBtn.textContent = 'Próximo →';
      }
    }

    // Update progress
    const progress = Math.round((this.currentSlide / this.totalSlides) * 100);
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
      progressCircle.setAttribute('data-progress', progress.toString());
      const degrees = (progress / 100) * 360;
      progressCircle.style.background = `conic-gradient(#1C2340 ${degrees}deg, #E5E9F0 ${degrees}deg)`;
    }

    // Update slide counter
    const currentSlideNum = document.getElementById('current-slide-number');
    const totalSlidesNum = document.getElementById('total-slides');
    if (currentSlideNum) currentSlideNum.textContent = this.currentSlide.toString();
    if (totalSlidesNum) totalSlidesNum.textContent = this.totalSlides.toString();
  }
}
