import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificate',
  standalone: true,
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.css'
})
export class CertificateComponent implements OnInit {
  studentName = 'Maria Silva';

  ngOnInit(): void {
    const win = window as unknown as Record<string, any>;

    win["closeCertificate"] = () => {
      this.closeCertificate();
    };
  }

  closeCertificate(): void {
    document.getElementById('certificate-view')?.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}
