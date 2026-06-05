import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonService } from '../service/common.service';
import { TranslateService } from '@ngx-translate/core';

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
  carouselImages = [
    { file: 'angular-inter.png', altKey: 'HOME.CERTIFICATE_1_ALT' },
    { file: 'angular_basic.png', altKey: 'HOME.CERTIFICATE_2_ALT' },
    { file: 'infosys_angular.png', altKey: 'HOME.CERTIFICATE_3_ALT' },
    { file: 'infosys_frontend.png', altKey: 'HOME.CERTIFICATE_4_ALT' },
    { file: 'css-certificate.png', altKey: 'HOME.CERTIFICATE_5_ALT' }
  ];

  constructor(private commonService: CommonService, private translate: TranslateService){}

  ngOnInit(){
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.onResize(this.event);
    this.commonService.scrollToTarget.subscribe((data:any)=>{
      // console.log(data);
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
      // console.log('Window resized, new width:', this.windowWidth);
      if (this.windowWidth <= 768) {
       this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }

  downloadFile(){
    const link = document.createElement('a');
    link.href = '/assets/Niranjan_Abathurai_2026.pdf';
    link.download = 'Niranjan_Abathurai_2026.pdf'; // Set the file name for the download
    link.click(); // Simulate a click to start downloading
  }
}
