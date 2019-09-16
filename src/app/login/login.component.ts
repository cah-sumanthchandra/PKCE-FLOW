import {Component} from '@angular/core';
import {OktaPkceAuthService} from '../common/okta-pkce-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username: string;
  password: string;

  constructor(private oktaAuthService: OktaPkceAuthService) {}

  login() {
    this.oktaAuthService.login(this.username, this.password);
  }
}
