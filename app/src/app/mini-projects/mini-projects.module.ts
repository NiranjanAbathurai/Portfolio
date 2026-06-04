import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiniProjectsRoutingModule } from './mini-projects-routing.module';
import { MiddlePaneComponent } from './app/middle-pane/middle-pane.component';
import { RightPaneComponent } from './app/right-pane/right-pane.component';
import { FormsModule } from '@angular/forms';
import { LazyAppComponent } from './app/lazyapp.component';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideClientHydration } from '@angular/platform-browser';

@NgModule({
  declarations: [
    LazyAppComponent,
    MiddlePaneComponent,
    RightPaneComponent
  ],
  imports: [
    CommonModule,
    MiniProjectsRoutingModule,
    FormsModule,
     TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader
      }
    })
  ],
  providers: [
    provideClientHydration(),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ],
})
export class MiniProjectsModule { }
