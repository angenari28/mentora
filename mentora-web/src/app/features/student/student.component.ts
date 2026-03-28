import { Component, computed, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { ClassStudentService } from 'app/services/class-student.service';
import { StudentClassesResponse } from 'app/services/responses/student-classes.response';
import { WorkloadHoursPipe } from 'app/pipes/workload-hours.pipe';
import { CacheService, cacheToken } from '@services/cache.service';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [HeaderComponent, CoursePlayerComponent, WorkloadHoursPipe, PercentPipe],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  @ViewChild(CoursePlayerComponent) private player!: CoursePlayerComponent;

  readonly studentId = signal<string>('');
  readonly classes = signal<StudentClassesResponse[]>([]);
  readonly loadingClasses = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly studentName = computed(
    () => (this.cacheService.getLocalStorage(cacheToken.student_name) as string) || '',
  );

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
    this.getCourses();

    const win = window as unknown as Record<string, any>;
    win['openCourse'] = (classe: StudentClassesResponse) => this.player.open(classe);
    win['closeCourse'] = () => this.player.close();
    win['closeCertificate'] = () => {
      document.getElementById('certificate-view')?.classList.remove('active');
    };
    win['nextSlide'] = () => this.player.next();
    win['previousSlide'] = () => this.player.previous();
    win['selectQuizOption'] = (el: HTMLElement, isCorrect: boolean) =>
      this.player.selectQuizOption(el, isCorrect);
  }

  ngOnDestroy(): void {
    const win = window as unknown as Record<string, any>;
    delete win['openCourse'];
    delete win['closeCourse'];
    delete win['closeCertificate'];
    delete win['nextSlide'];
    delete win['previousSlide'];
    delete win['selectQuizOption'];
  }

  protected reloadCourses(): void {
    this.getCourses();
  }

  private getCourses(): void {
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
        },
      });
    }
  }

  protected openCourse(classe: StudentClassesResponse): void {
    this.player.open(classe);
  }

  protected loadCourseImage(course: StudentClassesResponse): string {
    if (course.course.faceImage) {
      return course.course.faceImage.startsWith('data:')
        ? course.course.faceImage
        : `data:image/png;base64,${course.course.faceImage}`;
    }
    return '';
  }

  protected loadPercentegeCourse(classes: StudentClassesResponse): {toView: number, toStyle: number} {
    const totalSlides = classes.course.slides.length;
    const totalSlideCompleted = classes.course.slides.filter(s => s.courseSlideTime?.dateEnd).length;
    if (totalSlides === 0) return { toView: 0, toStyle: 0 };
    const percentage = totalSlideCompleted / totalSlides;
    return { toView: percentage, toStyle: percentage * 100 };
  }
}
