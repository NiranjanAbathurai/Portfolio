import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  windowWidth !: number;
  isMobile !: boolean;
  event !: Event;

  ngOnInit(){
    this.onResize(this.event)
  }

    @HostListener('window:resize',['$event'])
    onResize(event:Event){
      this.windowWidth = window.innerWidth;
      console.log('Window resized, new width:', this.windowWidth);
      if (this.windowWidth <= 768) {
       this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }

  downloadFile(){
    const link = document.createElement('a');
    link.href = '/assets/Niranjan_Abathurai_2025.pdf';
    link.download = 'Niranjan_Abathurai_2025.pdf'; // Set the file name for the download
    link.click(); // Simulate a click to start downloading
  }
}
