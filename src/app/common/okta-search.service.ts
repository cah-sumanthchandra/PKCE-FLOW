import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {TypeaheadUser} from '../models/typeahead-user';
import {Factor} from '../models/factor';
import {OktaApp} from '../models/okta-app';

@Injectable({
    providedIn: 'root'
})
export class OktaSearchService {

    private oktaSearchUrl = environment.oktaSearchURL;

    constructor(private httpClient: HttpClient) {}

    public getFilteredUsers(userFilter: string, org: string) : Observable<TypeaheadUser[]> {
        let params = new HttpParams().set('filter', userFilter).set('org', org);
        return this.httpClient.get<TypeaheadUser[]>(this.oktaSearchUrl + '/users', {params: params});
    }

    public getUserAppsAndGroups(userId: string, org: string) : Observable<any> {
        let params = new HttpParams()
            .set('org', org);
        return this.httpClient.get(this.oktaSearchUrl + '/users/' + userId + '/apps', {params: params});
    }

    public getFactorsForUser(userId: string, org: string): Observable<Factor[]> {
        let params = new HttpParams()
            .set('org', org);
        return this.httpClient.get<Factor[]>(this.oktaSearchUrl + '/users/' + userId + '/factors', {params: params});
    }

    public getOKTAApps(appLabelFilter: string, org: string) : Observable<OktaApp[]> {
        let params = new HttpParams().set('q', appLabelFilter).set('org', org);
        return this.httpClient.get<OktaApp[]>(this.oktaSearchUrl + '/apps', {params: params});
    }
}