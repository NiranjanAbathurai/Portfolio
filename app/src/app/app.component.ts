import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';

  constructor(private translate: TranslateService){
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang() || 'en';
    this.translate.use(browserLang);
  }
}
