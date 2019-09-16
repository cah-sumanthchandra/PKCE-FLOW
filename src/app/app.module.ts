import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {httpInterceptorProviders} from './interceptors';
import {OktaSearchService} from './common/okta-search.service';
import {AuthCodeCallbackComponent} from './auth-code-callback.component';
import {PKCEAuthGuard} from './guards/pkce-auth-guard.service';
import {MaterialModule} from './material/material.module';
import {ImplicitCallbackComponent} from './implicit-callback-component';

@NgModule({
  declarations: [
    AppComponent,
    AuthCodeCallbackComponent,
    ImplicitCallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [
    httpInterceptorProviders,
    OktaSearchService,
    AuthCodeCallbackComponent,
    PKCEAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
