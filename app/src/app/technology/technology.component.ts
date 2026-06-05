import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./technology.component.scss'],
  imports: [CommonModule, TranslateModule]
})
export class TechnologyComponent {

  toolsUsed = ['Figma','Splunk','Postman','Spinnaker','Rio','MongoDB compass','SAP Commernce Cloud','JIRA'];
  versionControl = ['Git','Bitbucket','Microsoft Azure'];
  ideWorked = ['Visual studio code', 'Eclipse IDE']
}
