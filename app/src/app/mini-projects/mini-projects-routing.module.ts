import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LazyAppComponent } from './app/lazyapp.component';

const routes: Routes = [
  {
    path:'',component: LazyAppComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiniProjectsRoutingModule { }
