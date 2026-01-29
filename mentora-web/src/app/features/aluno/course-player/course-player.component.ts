import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-player',
  standalone: true,
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.css'
})
export class CoursePlayerComponent implements OnInit, OnDestroy {
  private currentSlide = 1;
  private readonly totalSlides = 5;

  ngOnInit(): void {
    const win = window as unknown as Record<string, any>;

    win["closeCourse"] = () => {
      document.getElementById('course-player')?.classList.remove('active');
    };

    win["closeCertificate"] = () => {
      document.getElementById('certificate-view')?.classList.remove('active');
    };

    win["previousSlide"] = () => {
      if (this.currentSlide > 1) {
        this.updateSlide(this.currentSlide - 1);
      }
    };

    win["nextSlide"] = () => {
      if (this.currentSlide < this.totalSlides) {
        this.updateSlide(this.currentSlide + 1);
      }
    };

    win["selectQuizOption"] = (element: HTMLElement, isCorrect: boolean) => {
      const options = document.querySelectorAll('.quiz-option');
      options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));

      element.classList.add('selected');
      element.classList.add(isCorrect ? 'correct' : 'incorrect');

      const feedback = document.getElementById('quiz-feedback');
      if (feedback) {
        feedback.classList.add('show', isCorrect ? 'correct' : 'incorrect');
      }
    };
  }

  ngOnDestroy(): void {
    const win = window as unknown as Record<string, any>;
    delete win["closeCourse"];
    delete win["closeCertificate"];
    delete win["previousSlide"];
    delete win["nextSlide"];
    delete win["selectQuizOption"];
  }

  private updateSlide(slideNumber: number): void {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator-dot');

    // Remover classe active de todos os slides
    slides.forEach((slide) => {
      slide.classList.remove('active');
    });

    // Adicionar classe active ao slide correto
    slides.forEach((slide, index) => {
      if (index + 1 === slideNumber) {
        slide.classList.add('active');
      }
    });

    // Atualizar indicadores
    indicators.forEach((indicator, index) => {
      if (index + 1 === slideNumber) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    // Atualizar número do slide atual
    const currentSlideNum = document.getElementById('current-slide-number');
    if (currentSlideNum) {
      currentSlideNum.textContent = slideNumber.toString();
    }

    // Resetar feedback do quiz quando mudar de slide
    const quizFeedback = document.getElementById('quiz-feedback');
    if (quizFeedback) {
      quizFeedback.classList.remove('show', 'correct', 'incorrect');
    }

    // Resetar opções do quiz
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));

    this.currentSlide = slideNumber;
    this.updateNavigationButtons();
  }

  private updateNavigationButtons(): void {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.style.display = this.currentSlide === 1 ? 'none' : 'block';
    }

    if (nextBtn) {
      nextBtn.style.display = this.currentSlide === this.totalSlides ? 'none' : 'block';
    }
  }
}
