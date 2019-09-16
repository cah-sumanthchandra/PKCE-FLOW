import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {OktaOrg} from '../models/okta-org';
import {OktaApp} from '../models/okta-app';
import {OktaSearchService} from '../common/okta-search.service';
import {User} from '../models/user';
import {TypeaheadUser} from '../models/typeahead-user';
import {OktaGroup} from '../models/okta-group';
import {OktaPkceAuthService} from '../common/okta-pkce-auth.service';
import {OktaAppsAndGroups} from '../models/okta-apps-and-groups';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    selectedOrg: string;
    selectedUser: string;
    selectedUserId: string;
    orgControl = new FormControl();
    orgOptions: OktaOrg[];
    oktaOrgOptions: Observable<OktaOrg[]>;
    typeAheadUserControl = new FormControl({value: '', disabled: true});
    oktaTypeAheadUserUserOptions: Observable<TypeaheadUser[]>;
    oktaUsers: TypeaheadUser[];
    showUserTable =  false;
    apps: OktaApp[];
    groups: OktaGroup[];
    users: User[];
    appTableColumns: string[] = ['appLabel', 'groupName'];
    idToken: string;
    accessToken: string;
    appsAndGroups: MatTableDataSource<OktaAppsAndGroups[]>;
    showSpinner = false;

    constructor(private oktaSearchService: OktaSearchService, private authService: OktaPkceAuthService) {}

    async ngOnInit() {
        this.orgOptions = [
            {name: 'B2E'},
            {name: 'B2B'},
            {name: 'B2C'}
        ];
        this.trackOktaOrgOptions();
        this.trackOktaTypeAheadUserOptions();
        this.idToken = await this.authService.retrieveIDToken();
        this.accessToken = await this.authService.retrieveAccessToken();

    }

    displayOktaOrgs(org?: OktaOrg): string | undefined {
        return org ? org.name : undefined;
    }

    displayOktaUsers(user?: TypeaheadUser): string | undefined {
        return user ? user.name : undefined;
    }

    private _filter(name: string): OktaOrg[] {
        const filterValue = name.toLowerCase();
        return this.orgOptions.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    private trackOktaOrgOptions() {
        this.oktaOrgOptions = this.orgControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filter(name) : this.orgOptions.slice())
            );
    }

    private trackOktaTypeAheadUserOptions() {
        this.oktaTypeAheadUserUserOptions = this.typeAheadUserControl.valueChanges
            .pipe(
                debounceTime(300),
                switchMap(value => {
                    if(value.length >= 3 && typeof value.id === 'undefined') {
                        this.showUserTable = false;
                        return this.oktaSearchService.getFilteredUsers(value, this.selectedOrg);
                    } else {
                        return [];
                    }
                })
            );
        this.oktaTypeAheadUserUserOptions.subscribe(value => this.oktaUsers = value);
    }

    orgSelected(org: string) {
        this.selectedOrg = org;
        this.typeAheadUserControl.reset({value: '', disabled: false});
        this.oktaUsers = [];
    }

    userSelected(eventVal) {
        this.groups = [];
        this.apps = [];
        this.selectedUser = eventVal.name;
        this.selectedUserId = eventVal.id;
        this.appsAndGroups = new MatTableDataSource([]);
        this.showSpinner = true;
        this.getAppsAndGroups(this.selectedUserId, this.selectedOrg);
    }

    private getAppsAndGroups(selectedUserId: string, selectedOrg: string) {
        this.oktaSearchService.getUserAppsAndGroups(selectedUserId, selectedOrg)
            .subscribe(resp => {
                this.showSpinner = false;
                this.showUserTable = true;
                this.appsAndGroups = new MatTableDataSource<OktaAppsAndGroups[]>(resp);
            });
    }

    trackUserFilterChanges(filterValue: string) {
       this.appsAndGroups.filter = filterValue.trim().toLowerCase();
    }
}
