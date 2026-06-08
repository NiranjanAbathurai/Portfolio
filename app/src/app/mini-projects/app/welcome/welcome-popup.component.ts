import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-welcome-modal',
  templateUrl: './welcome-popup.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, FormsModule, TranslateModule]
})

export class WelcomeModalComponent {
  @Output() closed = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  close() {
    // Remember that the user has seen the modal (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
    this.closed.emit();
  }
}