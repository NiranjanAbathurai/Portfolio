import { Component, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './work-experience.component.scss'
})
export class WorkExperienceComponent {

  windowWidth !: number;
  isMobile = signal<boolean>(false);
  event !: Event
  jobDetails = [ 
    {
      roleKey: 'WORK_EXPERIENCE.JOB_1.ROLE',
      companyKey: 'WORK_EXPERIENCE.JOB_1.COMPANY',
      projectNameKey: 'WORK_EXPERIENCE.JOB_1.PROJECT_NAME',
      descriptionKeys: [
        'WORK_EXPERIENCE.JOB_1.DESCRIPTION_1',
        'WORK_EXPERIENCE.JOB_1.DESCRIPTION_2',
        'WORK_EXPERIENCE.JOB_1.DESCRIPTION_3',
        'WORK_EXPERIENCE.JOB_1.DESCRIPTION_4',
        'WORK_EXPERIENCE.JOB_1.DESCRIPTION_5'
      ]
    },
    {
      roleKey: 'WORK_EXPERIENCE.JOB_2.ROLE',
      companyKey: 'WORK_EXPERIENCE.JOB_2.COMPANY',
      projectNameKey: 'WORK_EXPERIENCE.JOB_2.PROJECT_NAME',
      descriptionKeys: [
        'WORK_EXPERIENCE.JOB_2.DESCRIPTION_1',
        'WORK_EXPERIENCE.JOB_2.DESCRIPTION_2',
        'WORK_EXPERIENCE.JOB_2.DESCRIPTION_3',
        'WORK_EXPERIENCE.JOB_2.DESCRIPTION_4'
      ]
    },
    {
      roleKey: 'WORK_EXPERIENCE.JOB_3.ROLE',
      companyKey: 'WORK_EXPERIENCE.JOB_3.COMPANY',
      projectNameKey: 'WORK_EXPERIENCE.JOB_3.PROJECT_NAME',
      descriptionKeys: [
        'WORK_EXPERIENCE.JOB_3.DESCRIPTION_1',
        'WORK_EXPERIENCE.JOB_3.DESCRIPTION_2',
        'WORK_EXPERIENCE.JOB_3.DESCRIPTION_3',
        'WORK_EXPERIENCE.JOB_3.DESCRIPTION_4'
      ]
    },
    {
      roleKey: 'WORK_EXPERIENCE.JOB_4.ROLE',
      companyKey: 'WORK_EXPERIENCE.JOB_4.COMPANY',
      projectNameKey: 'WORK_EXPERIENCE.JOB_4.PROJECT_NAME',
      descriptionKeys: [
        'WORK_EXPERIENCE.JOB_4.DESCRIPTION_1',
        'WORK_EXPERIENCE.JOB_4.DESCRIPTION_2',
        'WORK_EXPERIENCE.JOB_4.DESCRIPTION_3',
        'WORK_EXPERIENCE.JOB_4.DESCRIPTION_4'
      ]
    }
  ]

  constructor(private router:Router){}

  ngOnInit(){
    this.onResize(this.event)
  }

  @HostListener('window:resize',['$event'])
  onResize(event:Event){
    this.windowWidth = window.innerWidth;
    // console.log('Window resized, new width:', this.windowWidth);
    if (this.windowWidth <= 768) {
      this.isMobile.set(true);
    } else {
      this.isMobile.set(false);
    }
  }

  onClick(){
    this.router.navigate(['mini-projects'])
  }

}
