import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { ClassStudentService } from 'app/services/class-student.service';
import { StudentClassesResponse } from 'app/services/responses/student-classes.response';
import { WorkloadHoursPipe } from 'app/pipes/workload-hours.pipe';
import { CacheService, cacheToken } from '@services/cache.service';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [HeaderComponent, CoursePlayerComponent, WorkloadHoursPipe],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  public currentSlide = 0;
  public totalSlides = 5;

  readonly studentId = signal<string>('');
  readonly classes = signal<StudentClassesResponse[]>([]);
  readonly loadingClasses = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly studentName = computed(() => this.cacheService.getLocalStorage(cacheToken.student_name) || '');

  readonly classesByCategory = computed(() => {
    const map = new Map<string, { name: string; classes: StudentClassesResponse[] }>();
    for (const cls of this.classes()) {
      const catId = cls.course.category.id;
      if (!map.has(catId)) {
        map.set(catId, { name: cls.course.category.name, classes: [] });
      }
      map.get(catId)!.classes.push(cls);
    }
    return Array.from(map.values());
  });

  private readonly titleService = inject(Title);
  private readonly route = inject(ActivatedRoute);
  private readonly classStudentService = inject(ClassStudentService);
  private readonly cacheService = inject(CacheService);

  ngOnInit(): void {
    this.titleService.setTitle('Aluno');

    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.studentId.set(id);

    if (id) {
      this.loadingClasses.set(true);
      this.classStudentService.getByStudentId(id).subscribe({
        next: (res) => {
          if (res.success) this.classes.set(res.data);
          else this.loadError.set(res.message);
          this.loadingClasses.set(false);
        },
        error: () => {
          this.loadError.set('Erro ao carregar turmas do aluno.');
          this.loadingClasses.set(false);
        }
      });
    }
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
