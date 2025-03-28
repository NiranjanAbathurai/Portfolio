import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiniProjectsRoutingModule } from './mini-projects-routing.module';
import { MiddlePaneComponent } from './app/middle-pane/middle-pane.component';
import { RightPaneComponent } from './app/right-pane/right-pane.component';
import { FormsModule } from '@angular/forms';
import { LazyAppComponent } from './app/lazyapp.component';


@NgModule({
  declarations: [
    LazyAppComponent,
    MiddlePaneComponent,
    RightPaneComponent
  ],
  imports: [
    CommonModule,
    MiniProjectsRoutingModule,
    FormsModule
  ]
})
export class MiniProjectsModule { }
