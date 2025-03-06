import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  downloadFile(){
    const link = document.createElement('a');
    link.href = '/assets/Niranjan_Abathurai_2025.pdf';
    link.download = 'Niranjan_Abathurai_2025.pdf'; // Set the file name for the download
    link.click(); // Simulate a click to start downloading
  }
}
