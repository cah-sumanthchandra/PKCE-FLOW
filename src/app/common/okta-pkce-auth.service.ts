import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import OktaAuth from '@okta/okta-auth-js';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OktaPkceAuthService {

    LOGIN_REDIRECT_URL =  window.location.origin;
    AUTH_CODE_REDIRECT_URL = this.LOGIN_REDIRECT_URL + '/authorization-code/callback';
    IMPLICT_REDIRECT_URL = this.LOGIN_REDIRECT_URL + '/implicit/callback';
    oktaAuth: any;

    config = {
        url: environment.issuerUrl,
        issuer: environment.issuerUrl,
        clientId: environment.clientId,
        tokenManager: {
            autoRenew: false
        }
    };

    private isAuthenticatedSource = new Subject<boolean>();
    isAuthenticated$ = this.isAuthenticatedSource.asObservable();

    constructor(private router: Router, private ngZone: NgZone) {
        this.oktaAuth = new OktaAuth(this.config);
        this.oktaAuth.tokenManager.on('expired', (key, expiredToken) => {
            console.log('Token with key', key, ' has expired:');
        });
        this.oktaAuth.tokenManager.on('error', err => {
            console.log('TokenManager error:', err.message);
        });
    }

    login(userName: string, password: string) {
        let self = this;
        this.config['redirectUri'] = this.LOGIN_REDIRECT_URL;
        this.oktaAuth = new OktaAuth(this.config);
        this.oktaAuth.signIn({
            username: userName,
            password: password
        }).then(function(transaction) {
            if (transaction.status === 'SUCCESS') {
                self.oktaAuth.session.setCookieAndRedirect(transaction.sessionToken, self.config['redirectUri']); // Sets a cookie on redirect
            } else {
                throw 'We cannot handle the ' + transaction.status + ' status';
            }
        })
            .fail(function(err) {
                console.error(err);
            });
    }

    initiateAuthCodeFlow() {
        console.log('Is Auth Code flow supported by the Browser? ' + OktaAuth.features.isPKCESupported());
        if(OktaAuth.features.isPKCESupported()) {
            console.log('Stating Auth Code flow');
            this.config['redirectUri'] = this.AUTH_CODE_REDIRECT_URL;
            this.config['pkce'] = environment.pkce;
            this.config['grantType'] = environment.grantType;
            this.oktaAuth = new OktaAuth(this.config);
            this.oktaAuth.token.getWithRedirect({
                responseType: 'code',
                prompt: 'none',
                scopes: ['openid', 'profile', 'email']
            }).catch(error => {
                console.log('Auth code flow error\n' + error);
                this.router.navigate(['/login']).then();
            });
        } else {
            this.config['redirectUri'] = this.IMPLICT_REDIRECT_URL;
            this.oktaAuth = new OktaAuth(this.config);
            this.oktaAuth.token.getWithRedirect({
                responseType: ['token', 'id_token'],
                prompt: 'none'
            }).catch(error => {
                console.log('Implicit flow error\n' + error);
                this.router.navigate(['/login']).then();
            });
        }
    }

    redirect() {
        if(OktaAuth.features.isPKCESupported()) {
            this.config['redirectUri'] = this.AUTH_CODE_REDIRECT_URL;
        } else {
            this.config['redirectUri'] = this.IMPLICT_REDIRECT_URL;
        }
        this.oktaAuth = new OktaAuth(this.config);
        let self = this;
        this.oktaAuth.token.parseFromUrl()
            .then((tokens) => {
                tokens.forEach((token) => {
                    if (token.idToken) {
                        this.oktaAuth.tokenManager.add('id_token', token);
                    } else if (token.accessToken) {
                        this.oktaAuth.tokenManager.add('access_token', token);
                    }
                });
                this.ngZone.run(() => this.router.navigate(['/'])).then();
            })
            .catch(function (error) {
                console.log('I am in Auth Code flow redirect error');
                console.log(JSON.stringify(error));
                self.ngZone.run(() => self.router.navigate(['/login']));
            });
    }

    async setObservables() {
        let idToken = await this.oktaAuth.tokenManager.get('id_token');
        this.isAuthenticatedSource.next(typeof idToken !== 'undefined' && idToken !== null && idToken !== '');
    }

    async retrieveIDToken() {
        let token = await this.getIdToken();
        return JSON.stringify(token, undefined, 2);
    }

    async retrieveAccessToken() {
        let token = await this.getAccessToken();
        return JSON.stringify(token, undefined, 2);
    }

    async validateToken() {
        let token = await this.getIdToken();
        return typeof token !== 'undefined' && token !== null && token !== '';
    }

    getIdToken() {
        return this.oktaAuth.tokenManager.get('id_token');
    }

    getAccessToken() {
        return this.oktaAuth.tokenManager.get('access_token');
    }

    async logout() {
        await this.oktaAuth.signOut();
        await this.oktaAuth.tokenManager.clear();
        await this.setObservables();
        this.router.navigate(['/login']).then();
    }
}