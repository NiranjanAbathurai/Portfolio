import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonService } from '../service/common.service';

import * as angJson from '../../../../app/angular.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  windowWidth !: number;
  isMobile !: boolean;
  event !: Event;
  @ViewChild('projectsViewChild') projectsSection: ElementRef | undefined;
  @ViewChild('skillsViewChild') skillsSection: ElementRef | undefined;
  @ViewChild('contactViewChild') contactSection: ElementRef | undefined;
  jsonFile !: any;

  constructor(private commonService: CommonService){}

  ngOnInit(){
    this.onResize(this.event);
    this.commonService.scrollToTarget.subscribe((data:any)=>{
      console.log(data);
      if (this.projectsSection && data == 'projectsViewChild') {
        this.projectsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      } else if (this.skillsSection && data == 'skillsViewChild') {
        this.skillsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      } else if (this.contactSection && data == 'contactViewChild') {
        this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      } 
    });
    this.jsonFile = angJson

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
