import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UtilitiesComponent} from './utilities.component';
import {UtilitiesRoutingModule} from './utilities-routing.module';
import {MaterialModule} from '../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    UtilitiesComponent
  ],
  imports: [
    CommonModule,
    UtilitiesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UtilitiesModule { }
