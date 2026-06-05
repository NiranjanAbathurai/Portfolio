import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./dropdown.component.scss'],
  imports: [CommonModule]
})
export class DropdownComponent {
@Input() options: DropdownOption[] = [];
  
  // Pass in the currently selected value
  @Input() selectedValue: string = '';
  
  // Emits the new value back to the parent component
  @Output() selectionChange = new EventEmitter<string>();

  isOpen: boolean = false;

  constructor(private eRef: ElementRef) {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(value: string, event: Event) {
    event.stopPropagation();
    this.selectedValue = value;
    this.selectionChange.emit(this.selectedValue); // Notify parent
    this.isOpen = false;
  }

  get selectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.selectedValue);
    return selected ? selected.label : 'Select Option';
  }

  // Closes the dropdown if the user clicks outside of it
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
