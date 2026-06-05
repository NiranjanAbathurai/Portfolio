import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app-routing.module';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

// Factory function for TranslateLoader
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// export function HttpLoaderFactory(http: HttpClient) {
//   // Use the configuration object pattern
//   return new TranslateHttpLoader(http, {
//     prefix: './assets/i18n/',
//     suffix: '.json'
//   });
// }

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Ensure your routes are exported
    provideClientHydration(withNoIncrementalHydration()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      })
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.use(translate.getBrowserLang() || 'en');
    })
  ]
};