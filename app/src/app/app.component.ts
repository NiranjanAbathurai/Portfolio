import { Component, ChangeDetectionStrategy, Inject, PLATFORM_ID, signal } from '@angular/core';
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

  /** Splash screen state — starts false; set to true only in browser to avoid SSR/crawler issues */
  showSplash = signal<boolean>(false);
  splashDone = signal<boolean>(false);
  activeGreeting = signal<string>('');
  greetingVisible = signal<boolean>(false);
  splashExiting = signal<boolean>(false);

  private greetings = ['Hello', 'Bonjour', 'Hola', 'வணக்கம்', 'नमस्ते'];

  constructor(private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object){
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang() || 'en';
    this.translate.use(browserLang);
  }
  
  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('hasSeenWelcome');
      // Show splash immediately in browser — the #pre-splash in index.html
      // covers the gap before Angular renders this overlay
      this.showSplash.set(true);
      this.runSplashSequence();
    } else {
      // SSR: skip splash so crawlers see actual page content
      this.splashDone.set(true);
    }
  }

  private runSplashSequence(): void {
    const duration = 400; // ms per greeting
    let index = 0;

    // Show first greeting immediately
    this.activeGreeting.set(this.greetings[0]);
    this.greetingVisible.set(true);

    const interval = setInterval(() => {
      index++;
      if (index < this.greetings.length) {
        // Briefly hide to force Angular to re-create the <span>, re-triggering CSS animation
        this.greetingVisible.set(false);
        setTimeout(() => {
          this.activeGreeting.set(this.greetings[index]);
          this.greetingVisible.set(true);
        }, 50);
      } else {
        clearInterval(interval);
        // Start exit animation after last greeting
        setTimeout(() => {
          this.splashExiting.set(true);
          // After exit animation completes, hide splash
          setTimeout(() => {
            this.showSplash.set(false);
            this.splashDone.set(true);
          }, 600); // matches CSS exit animation duration
        }, 300);
      }
    }, duration);
  }
}
