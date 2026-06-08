import { Component, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, HeaderComponent, FooterComponent, CommonModule]
})
export class AppComponent {
  title = 'app';

  constructor(private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object){
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang() || 'en';
    this.translate.use(browserLang);
  }
  
  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('hasSeenWelcome');
    }
  }
}
