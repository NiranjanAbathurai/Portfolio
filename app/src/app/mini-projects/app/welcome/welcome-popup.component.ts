import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
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

  close() {
    // Remember that the user has seen the modal
    localStorage.setItem('hasSeenWelcome', 'true');
    this.closed.emit();
  }
}