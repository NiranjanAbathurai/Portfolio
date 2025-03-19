import { Component } from '@angular/core';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.scss'
})
export class TechnologyComponent {

  toolsUsed = ['Figma','Splunk','Postman','Spinnaker','Rio','MongoDB compass','SAP Commernce Cloud','Tortoise git'];
  versionControl = ['Git','Bitbucket','Microsoft Azure'];
  ideWorked = ['Visual studio code', 'Eclipse IDE']
}
