import { Component, ElementRef, HostListener, ViewChild, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../service/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TechnologyComponent } from '../technology/technology.component';
import { WorkExperienceComponent } from '../work-experience/work-experience.component';
import { ContactComponent } from '../contact/contact.component';
import { HonorsAwardsComponent } from '../honors-awards/honors-awards.component';

import * as angJson from '../../../../app/angular.json';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, TranslateModule, TechnologyComponent, WorkExperienceComponent, ContactComponent, HonorsAwardsComponent]
})
export class HomeComponent {

  windowWidth !: number;
  isMobile !: boolean;
  event !: Event;
  @ViewChild('projectsViewChild') projectsSection: ElementRef | undefined;
  @ViewChild('skillsViewChild') skillsSection: ElementRef | undefined;
  @ViewChild('contactViewChild') contactSection: ElementRef | undefined;
  @ViewChild('awardsViewChild') awardsSection: ElementRef | undefined;
  jsonFile !: any;

  /** Download CV animation state (signals for Eager change detection) */
  isDownloading = signal(false);
  isDownloadComplete = signal(false);
  downloadProgress = signal(0);
  private downloadInterval: any;

  carouselImages = [
    { file: 'angular-inter.png', altKey: 'HOME.CERTIFICATE_1_ALT' },
    { file: 'angular_basic.png', altKey: 'HOME.CERTIFICATE_2_ALT' },
    { file: 'react_basic.png', altKey: 'HOME.CERTIFICATE_6_ALT' },
     { file: 'frontend_developer_react.png', altKey: 'HOME.CERTIFICATE_7_ALT' },
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
      } else if (this.awardsSection && data == 'awardsViewChild') {
        this.awardsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
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
    if (this.isDownloading() || this.isDownloadComplete()) return;

    this.isDownloading.set(true);
    this.downloadProgress.set(0);

    // Animate from 0% to 100% over ~2 seconds (40ms per tick, 2% per tick = 50 ticks × 40ms = 2s)
    this.downloadInterval = setInterval(() => {
      this.downloadProgress.update(v => v + 2);

      if (this.downloadProgress() >= 100) {
        this.downloadProgress.set(100);
        clearInterval(this.downloadInterval);

        // Brief pause at 100%, then show tick mark
        setTimeout(() => {
          this.isDownloading.set(false);
          this.isDownloadComplete.set(true);

          // Trigger actual file download after tick is shown
          setTimeout(() => {
            const link = document.createElement('a');
            link.href = '/assets/Niranjan_Abathurai_2026.pdf';
            link.download = 'Niranjan_Abathurai_2026.pdf';
            link.click();

            // Reset button after a short delay so it can be clicked again
            setTimeout(() => {
              this.isDownloadComplete.set(false);
            }, 1500);
          }, 600);
        }, 300);
      }
    }, 40);
  }
}
