import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: {
    gradient: string;
    emoji: string;
  };
  duration: string;
  progress: number;
  isCompleted?: boolean;
}

@Component({
  selector: 'app-course-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-carousel.component.html',
  styleUrl: './course-carousel.component.css'
})
export class CourseCarouselComponent {
  @Input() courses: Course[] = [];

  onCourseClick(courseId: string): void {
    const win = window as unknown as Record<string, any>;
    if (win["openCourse"]) {
      win["openCourse"](courseId);
    }
  }

  onStatsClick(event: Event): void {
    event.stopPropagation();
  }
}
