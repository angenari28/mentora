import { Component, inject, input, output, signal } from '@angular/core';
import { CertificateComponent } from './certificate/certificate.component';
import { StudentClassesResponse, SlideDetail } from '@services/responses/student-classes.response';
import { CourseSlideTimeService } from '@services/course-slide-time.service';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CertificateComponent],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.css'
})
export class CoursePlayerComponent {
  courses = input<StudentClassesResponse[]>([]);
  userId = input<string>('');
  studentName = input<string>('');
  readonly closed = output<void>();

  protected readonly activeSlides = signal<SlideDetail[]>([]);
  protected readonly currentSlide = signal(1);
  protected readonly courseName = signal('');
  protected readonly courseDuration = signal(0);
  protected readonly showingCertificate = signal(false);
  protected readonly courseShowCertificate = signal(false);
  protected readonly courseCompletionDate = signal<string>('');
  private totalSlides = 0;
  private currentSlideTimeId: string | null = null;

  private readonly courseSlideTimeService = inject(CourseSlideTimeService);

  open(classe: StudentClassesResponse): void {
    const completedSlides = classe.course.slides.filter(s => s.courseSlideTime?.dateEnd);
    this.courseDuration.set(classe.course.workloadHours);
    if (completedSlides.length === classe.course.slides.length && classe.course.slides.length > 0) {
      this.courseName.set(classe.course.name);
      const lastSlide = completedSlides[completedSlides.length - 1];
      this.courseCompletionDate.set(lastSlide?.courseSlideTime?.dateEnd ?? '');
      document.getElementById('certificate-view')?.classList.add('active');
      document.body.style.overflow = 'hidden';
      return;
    }

    const course = this.courses().find(c => c.course.id === classe.course.id);
    if (!course) return;

    this.activeSlides.set(course.course.slides);
    this.totalSlides = this.activeSlides().length;
    this.courseName.set(course.course.name);
    this.courseShowCertificate.set(course.course.showCertificate);

    document.getElementById('course-player')?.classList.add('active');
    document.body.style.overflow = 'hidden';

    const allCompleted = this.totalSlides > 0 &&
      this.activeSlides().every(s => !!s.courseSlideTime?.dateEnd);

    if (allCompleted && course.course.showCertificate) {
      this.currentSlide.set(this.totalSlides);
      this.showingCertificate.set(true);
      const lastSlide = this.activeSlides()[this.totalSlides - 1];
      this.courseCompletionDate.set(lastSlide?.courseSlideTime?.dateEnd ?? '');
      this.updateSlideDisplay();
      return;
    }

    this.showingCertificate.set(false);
    const inProgressIndex = this.activeSlides().findIndex(
      s => s.courseSlideTime?.dateStart && !s.courseSlideTime?.dateEnd
    );
    this.currentSlide.set(inProgressIndex >= 0 ? inProgressIndex + 1 : 1);
    this.updateSlideDisplay();
    this.onSlideEnter();
  }

  finish(): void {
    this.onSlideLeave(() => {
      this.showingCertificate.set(false);
      document.getElementById('course-player')?.classList.remove('active');
      this.closed.emit();
    });
  }

  openCertificateSlide(): void {
    this.onSlideLeave(() => {
      const lastSlide = this.activeSlides()[this.currentSlide() - 1];
      this.courseCompletionDate.set(lastSlide?.courseSlideTime?.dateEnd ?? new Date().toISOString());
      this.showingCertificate.set(true);
      this.updateSlideDisplay();
    });
  }

  close(): void {
    this.showingCertificate.set(false);
    this.currentSlideTimeId = null;
    document.getElementById('course-player')?.classList.remove('active');
    this.closed.emit();
  }

  next(): void {
    if (this.currentSlide() < this.totalSlides) {
      this.onSlideLeave(() => {
        this.currentSlide.update(v => v + 1);
        this.updateSlideDisplay();
        this.onSlideEnter();
      });
    } else {
      this.finish();
    }
  }

  previous(): void {
    if (this.currentSlide() > 1) {
      this.onSlideLeave(() => {
        this.currentSlide.update(v => v - 1);
        this.updateSlideDisplay();
        this.onSlideEnter();
      });
    }
  }

  selectQuizOption(element: HTMLElement, isCorrect: boolean): void {
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
          feedback.querySelector('.feedback-message')!.textContent =
            'Um líder eficaz inspira e capacita sua equipe, criando um ambiente colaborativo onde todos podem contribuir para o sucesso coletivo.';
        }
      } else {
        element.classList.add('incorrect');
        feedback?.classList.add('incorrect');
        if (feedback) {
          feedback.querySelector('.feedback-icon')!.textContent = '✕';
          feedback.querySelector('.feedback-title')!.textContent = 'Incorreto';
          feedback.querySelector('.feedback-message')!.textContent =
            'A liderança eficaz vai além da autoridade. Tente novamente após revisar o conteúdo.';
        }
      }
      feedback?.classList.add('show');
    }, 300);
  }

  private onSlideEnter(): void {
    const slide = this.activeSlides()[this.currentSlide() - 1];
    if (!slide) return;

    if (slide.courseSlideTime?.id && !slide.courseSlideTime.dateEnd) {
      this.currentSlideTimeId = slide.courseSlideTime.id;
      return;
    }

    this.courseSlideTimeService.create({
      userId: this.userId(),
      courseSlideId: slide.id,
      dateStart: new Date().toISOString()
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.currentSlideTimeId = res.data.id;
          slide.courseSlideTime = {
            id: res.data.id,
            dateStart: res.data.dateStart,
            dateEnd: null
          };
        }
      }
    });
  }

  private onSlideLeave(callback: () => void): void {
    const id = this.currentSlideTimeId;
    if (!id) {
      callback();
      return;
    }

    this.currentSlideTimeId = null;
    this.courseSlideTimeService.end(id, { dateEnd: new Date().toISOString() }).subscribe({
      next: (res) => {
        if (res.success) {
          const slide = this.activeSlides()[this.currentSlide() - 1];
          if (slide?.courseSlideTime) {
            slide.courseSlideTime = { ...slide.courseSlideTime, dateEnd: res.data.dateEnd };
          }
        }
      },
      complete: () => callback(),
      error: () => callback()
    });
  }

  private updateSlideDisplay(): void {
    const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;

    if (prevBtn) prevBtn.disabled = this.currentSlide() === 1;
    if (nextBtn) {
      nextBtn.textContent = this.currentSlide() === this.totalSlides ? '✓ Concluir' : 'Próximo →';
    }

    const progress = this.showingCertificate()
      ? 100
      : Math.round((this.currentSlide() - 1) / this.totalSlides * 100);
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
      progressCircle.setAttribute('data-progress', progress.toString());
      const degrees = (progress / 100) * 360;
      progressCircle.style.background = `conic-gradient(#1C2340 ${degrees}deg, #E5E9F0 ${degrees}deg)`;
    }
  }
}
