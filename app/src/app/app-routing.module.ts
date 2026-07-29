import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AgentComponent } from './agent/agent.component';
import { StockTrackingComponent } from './stock-tracking/stock-tracking.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'mini-projects', loadChildren: () => import('./mini-projects/mini-projects.module').then(m => m.MiniProjectsModule) },
  { path: 'ai-agent', component: AgentComponent },
  { path: 'stocks-tracking', component: StockTrackingComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
