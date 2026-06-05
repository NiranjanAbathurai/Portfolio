import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './technology.component.scss'
})
export class TechnologyComponent {

  toolsUsed = ['Figma','Splunk','Postman','Spinnaker','Rio','MongoDB compass','SAP Commernce Cloud','JIRA'];
  versionControl = ['Git','Bitbucket','Microsoft Azure'];
  ideWorked = ['Visual studio code', 'Eclipse IDE']
}
