import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {OktaPkceAuthService} from '../common/okta-pkce-auth.service';

@Injectable()
export class PKCEAuthGuard implements CanActivate {

    constructor(private authSerivce: OktaPkceAuthService) {}

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let isThereToken = await this.authSerivce.validateToken();
        if (!isThereToken) {
            console.log('Since there is active token initiating Auth Code Flow with PKCE');
            await this.authSerivce.initiateAuthCodeFlow();
            return false;
        }
        await this.authSerivce.setObservables();
        return true;
    }
}