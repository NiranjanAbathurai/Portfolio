import { Component, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.scss'
})
export class WorkExperienceComponent {

  windowWidth !: number;
  isMobile = signal<boolean>(false);
  event !: Event
  jobDetails = [ 
    {role:'Technology Analsyt', company:'Infosys, Ltd, Chennai', projectName: "Hershey's B2B", domain:'E-Commerce shopping site',
      description:[
        'Working on the development of new SAP Spartacus store front project with Angular 17 version.',
        'Developing responsive UI features according to the figma designs that supports mobile,tablet and desktop view',
        'Worked on registration form using reactive forms, Signals for auto updating changes and @media queries for handling responsiveness of the application',
        'Having hands-on experience in building and deploying the codebase in non-prod environment using SAP commerce cloud.'
      ]
    },
    {role:'Senior System Engineer', company:'Infosys, Ltd, Chennai', projectName: "Apple Inc,", domain:'Manufacturing & Processing',
      description: [
        'Worked on creating a user interactive web application where user upload images and process them in OCR and display the data',
        'Created responsive modal dialog with multiple table to add data and validations which will generate and download a report',
        'Have work experience in creating API using spring boot java and do CRUD operations in non-sql mongoDB collections',
        'Also build and deployed the codebase in IT and UAT using Rio and spinnaker tools'
      ]
    },
    {role:'System Engineer', company:'Tata Consultancy Services, Chennai', projectName: "NielsenIQ", domain:'Marketing and data analysing',
      description:[
        'Migrating an exisiting application to Angular 8 project and also optimizing performance of the application',
        'Worked on multiple angular features like Pipes, Directives, Route guards, Lazy loading modules and so on',
        'Creating and integrating API using HTTP modules with the help of Rxjs operators and Ngrx store concepts',
        'Also worked on ag-grid modules for adding grid data and displaying in simpler format'
      ]
    },
  ]

  constructor(private router:Router){}

  ngOnInit(){
    this.onResize(this.event)
  }

  @HostListener('window:resize',['$event'])
  onResize(event:Event){
    this.windowWidth = window.innerWidth;
    console.log('Window resized, new width:', this.windowWidth);
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
