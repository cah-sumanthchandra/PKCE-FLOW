import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportsComponent} from './reports.component';
import {ReportsRoutingModule} from './reports-routing.module';
import {ChartsModule} from 'ng2-charts';
import {AppUsersComponent} from './app-users/app-users.component';
import {MfaUsersComponent} from './mfa-users/mfa-users.component';
import {MfaUsersDialogComponent} from './mfa-users/mfa-users-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {AppGroupUsersDialogComponent} from './app-users/app-group-users-dialog.component';


@NgModule({
  declarations: [
    ReportsComponent,
    AppUsersComponent,
    MfaUsersComponent,
    MfaUsersDialogComponent,
    AppGroupUsersDialogComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    MaterialModule,
    MatDialogModule
  ],
  entryComponents: [
    MfaUsersDialogComponent,
    AppGroupUsersDialogComponent
  ]
})
export class ReportsModule { }
