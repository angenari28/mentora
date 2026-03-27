import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-certificate',
  standalone: true,
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.css'
})
export class CertificateComponent {
  studentName = input<string>('');
  courseName = input<string>('');
  completionDate = input<string>('');

  protected readonly formattedDate = computed(() => {
    const raw = this.completionDate();
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });
}
