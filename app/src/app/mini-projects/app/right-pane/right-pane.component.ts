import { Component } from '@angular/core';

@Component({
  selector: 'app-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrl: './right-pane.component.scss'
})
export class RightPaneComponent {

  searchFilter : string = ''
  items = [
    { name: 'Single Line Text', category: 'Text' , type:'input-text', description:'Single text area'},
    { name: 'Multi Line Text', category: 'Text' , type:'input-text-area' , description:'Multi text area'},
    { name: 'Integer', category: 'Text', type:'input-number', description:'Integer type area' },
    { name: 'Date', category: 'DateTime', type:'input-date' , description:'Select date from datepicker'},
    { name: 'Time', category: 'DateTime', type:'input-time', description:'Select time from timepicker' },
    { name: 'Date & Time', category: 'DateTime' , type:'input-date-time', description:'Select date and time from picker'},
    { name: 'Single Selection', category: 'Dropdown' , type:'input-single-select', description:'Select single option'},
    { name: 'Multi Selection', category: 'Dropdown', type:'input-multi-select', description:'Select multiple option' },
    { name: 'Dropdown', category: 'Dropdown' , type:'input-dropdown', description:'Select options from dropdown'},
    { name: 'Upload', category: 'Upload' , type:'input-file', description:'Upload documents/media files'}
  ];

  filterItemsByCategory(category: string) {
    return this.items.filter(item =>
      item.category === category &&
      item.name.toLowerCase().includes(this.searchFilter.toLowerCase())
    );
  }

  onDragStart(event: DragEvent, item: any) {
    event.dataTransfer?.setData('text', item.type); // Store the dragged item in dataTransfer
  }
}
