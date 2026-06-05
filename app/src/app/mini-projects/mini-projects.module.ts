import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiniProjectsRoutingModule } from './mini-projects-routing.module';
import { MiddlePaneComponent } from './app/middle-pane/middle-pane.component';
import { RightPaneComponent } from './app/right-pane/right-pane.component';
import { FormsModule } from '@angular/forms';
import { LazyAppComponent } from './app/lazyapp.component';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    MiniProjectsRoutingModule,
    FormsModule,
    LazyAppComponent,
    MiddlePaneComponent,
    RightPaneComponent,
    TranslateModule.forChild({
      extend: true,
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader
      }
    })
  ],
  providers: [
    provideClientHydration(withNoIncrementalHydration()),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ],
})
export class MiniProjectsModule { }
