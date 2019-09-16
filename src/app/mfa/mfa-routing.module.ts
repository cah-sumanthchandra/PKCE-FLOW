import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MfaComponent} from './mfa.component';

const routes: Routes = [
    {
        path: '',
        component: MfaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MfaRoutingModule { }