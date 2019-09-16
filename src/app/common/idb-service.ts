import {Injectable} from '@angular/core';
import Dexie from 'dexie';

@Injectable({
    providedIn: 'root'
})
export class IdbService {

    db: any;

    constructor() {}

    public createDB() {
        this.db = new Dexie('MyAnalytics');
        this.db.version(1).stores({
            mfaUsers: 'reportName',
            appUsers: 'reportName'
        });
        this.db.open().catch(err => {
            console.error (err.stack || err);
        });
    }

    public async addUsers(users: any) {
        if(users['reportName'].includes('User MFA')) {
            this.db.mfaUsers.put({
                reportName: users['reportName'],
                data: users[users['reportName']]
            }).then(value => {
                console.log('DB index created for Report: ' + value);
            });
        } else {
            this.db.appUsers.put({
                reportName: users['reportName'],
                data: users[users['reportName']]
            }).then(value => {
                console.log('DB index created for Report:' + value);
            });
        }
    }

    public async getReports() {
        let reportsMap = new Map();
        const mfaUserReports = await this.db.mfaUsers.toCollection();
        const appUserReports = await this.db.appUsers.toCollection();
        reportsMap.set('mfaUsers', mfaUserReports);
        reportsMap.set('appUsers', appUserReports);
        return reportsMap;
    }
}