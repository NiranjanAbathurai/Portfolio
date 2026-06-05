import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule, TranslateModule]
})
export class FooterComponent {
  projects = [
    { src: 'assets/projects/abbvie.png', alt: 'Abbvie' },
    { src: 'assets/projects/hersheys.png', alt: 'Hersheys' },
    { src: 'assets/projects/apple.png', alt: 'Apple' },
    { src: 'assets/projects/nielsen1.png', alt: 'Nielsen' },

  ];

  socials = [
    { src: 'assets/social/linkedIn.png', altKey: 'FOOTER.LINKEDIN', href: 'https://in.linkedin.com/in/niranjan-hari', target: '_blank' },
    { src: 'assets/social/gmail.png', altKey: 'FOOTER.GMAIL', href: 'mailto:niranjanhari464@gmail.com' },
    { src: 'assets/social/github.png', altKey: 'FOOTER.GITHUB', href: 'https://github.com/NiranjanAbathurai' },
    { src: 'assets/social/instagram.png', altKey: 'FOOTER.INSTAGRAM', href: 'https://www.instagram.com/niranjanhari' },
    { src: 'assets/social/facebook.png', altKey: 'FOOTER.FACEBOOK', href: 'https://www.facebook.com/niranjan.hari.1' }
  ];
}
