import {Component, OnInit} from '@angular/core';
import {OktaPkceAuthService} from './common/okta-pkce-auth.service';


@Component({
    selector: 'app-auth-code',
    templateUrl: './authcode.component.html'
})

export class AuthCodeCallbackComponent implements OnInit {

    constructor(private authCodeCallBackService: OktaPkceAuthService) {
        this.authCodeRedirect();
    }

    authCodeRedirect() {
        this.authCodeCallBackService.redirect();
    }

    ngOnInit() {}
}