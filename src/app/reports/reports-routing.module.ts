import {RouterModule, Routes} from '@angular/router';
import {ReportsComponent} from './reports.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
