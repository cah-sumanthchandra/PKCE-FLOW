import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {OktaOrg} from '../models/okta-org';
import {Observable} from 'rxjs';
import {TypeaheadUser} from '../models/typeahead-user';
import {OktaApp} from '../models/okta-app';
import {OktaGroup} from '../models/okta-group';
import {OktaSearchService} from '../common/okta-search.service';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {Factor} from '../models/factor';

@Component({
  selector: 'app-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.scss']
})
export class MfaComponent implements OnInit {

  selectedOrg: string;
  selectedUser: string;
  selectedUserId: string;
  orgControl = new FormControl();
  orgOptions: OktaOrg[];
  oktaOrgOptions: Observable<OktaOrg[]>;
  typeAheadUserControl = new FormControl({value: '', disabled: true});
  oktaTypeAheadUserUserOptions: Observable<TypeaheadUser[]>;
  showUserTable =  false;
  apps: OktaApp[];
  groups: OktaGroup[];
  factors: Factor[];
  factorTableColumns: string[] = ['factorType', 'factorProvider', 'status'];

  constructor(private oktaSearchService: OktaSearchService) {
    this.orgOptions = [
      {name: 'B2E'},
      {name: 'B2B'},
      {name: 'B2C'}
    ];
  }

  ngOnInit() {
    this.trackOktaOrgOptions();
    this.trackOktaTypeAheadUserOptions();
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
  }

  orgSelected(org: string) {
    if(this.typeAheadUserControl) {
      this.typeAheadUserControl.reset();
    }
    this.selectedOrg = org;
    this.typeAheadUserControl.reset({value: '', disabled: false});
  }

  userSelected(eventVal) {
    this.groups = [];
    this.apps = [];
    this.selectedUser = eventVal.name;
    this.selectedUserId = eventVal.id;
    this.showUserTable = true;
    this.getFactorsForUser(this.selectedUserId, this.selectedOrg);
  }

  private getFactorsForUser(selectedUserId: string, selectedOrg: string) {
    this.oktaSearchService.getFactorsForUser(selectedUserId, selectedOrg)
        .subscribe(resp => {
          this.factors = resp;
        });
  }
}
