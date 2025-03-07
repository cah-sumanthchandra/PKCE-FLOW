import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UtilitiesComponent} from './utilities.component';

const routes: Routes = [
    {
        path: '',
        component: UtilitiesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilitiesRoutingModule { }