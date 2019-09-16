import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MfaRoutingModule} from './mfa-routing.module';
import {MfaComponent} from './mfa.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';



@NgModule({
  declarations: [
    MfaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MfaRoutingModule
  ]
})
export class MfaModule { }
