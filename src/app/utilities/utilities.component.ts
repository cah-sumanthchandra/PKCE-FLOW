import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {OktaOrg} from '../models/okta-org';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {OktaApp} from '../models/okta-app';
import {OktaSearchService} from '../common/okta-search.service';
import {SocketService} from '../common/socket-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.scss']
})
export class UtilitiesComponent implements OnInit {

  orgControl = new FormControl();
  orgOptions: OktaOrg[];
  oktaOrgOptions: Observable<OktaOrg[]>;
  selectedOrg: string;
  appControl = new FormControl({value: '', disabled: true});
  oktaAppOptions: Observable<OktaApp[]>;
  selectedAppId: string;
  disabled = true;
  panelOpenState = false;

  constructor(private oktaSearchService: OktaSearchService,
              private socketService: SocketService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.orgOptions = [
      {name: 'B2E'},
      {name: 'B2B'},
      {name: 'B2C'}
    ];
    this.trackOktaOrgOptions();
    this.trackOktaAppOptions();
  }

  displayOktaOrgs(org?: OktaOrg): string | undefined {
    return org ? org.name : undefined;
  }

  private trackOktaOrgOptions() {
    this.oktaOrgOptions = this.orgControl.valueChanges
        .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.orgOptions.slice())
        );
  }

  private _filter(name: string): OktaOrg[] {
    const filterValue = name.toLowerCase();
    return this.orgOptions.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  orgSelected(org: string) {
    this.selectedOrg = org;
    this.appControl.reset({value: '', disabled: false});
    if (this.panelOpenState) {
      this.disabled = false;
    }
  }

  displayOktaApps(app?: OktaApp): string | undefined {
    return app ? app.label : undefined;
  }

  appSelected(eventVal) {
    this.selectedAppId = eventVal.id;
    this.disabled = false;
  }

  private trackOktaAppOptions() {
    this.oktaAppOptions = this.appControl.valueChanges
        .pipe(
            debounceTime(300),
            switchMap(value => {
              if(value.length >= 3 && typeof value.id === 'undefined') {
                return this.oktaSearchService.getOKTAApps(value, this.selectedOrg);
              } else {
                return [];
              }
            })
        );
  }

  reset() {
    this.disabled = true;
    this.orgControl.reset({value: '', disabled: false});
  }

  getAppUsers() {
    this.socketService.retrieveUsers(this.selectedOrg, this.selectedAppId);
  }

  getUserFactors() {
    this.socketService.retrieveUserFactors(this.selectedOrg);
  }

  openSnackBar() {
    this.snackBar.open("Your request has been submitted. Once retrieved, data will be available under documents page.", "", {
      duration: 2000,
      verticalPosition: 'top'
    });
  }


}
