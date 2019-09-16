import {Component, OnInit} from '@angular/core';
import {OktaPkceAuthService} from './common/okta-pkce-auth.service';
import {ComponentService} from './common/component-service';
import {IdbService} from './common/idb-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'OKTA User Analytics';
    isAuthenticated: boolean;
    documentList: number;

    constructor(private authService: OktaPkceAuthService,
                private componentService: ComponentService,
                private idbService: IdbService) {
        this.authService.isAuthenticated$.subscribe(
            authenticated => {
                this.isAuthenticated = authenticated;
            });
        this.componentService.reportCount$.subscribe(
            reportCount => {
                this.documentList = reportCount;
            });
    }

    ngOnInit() {
        this.idbService.createDB();
    }

    logout() {
        this.authService.logout().then();
    }
}
