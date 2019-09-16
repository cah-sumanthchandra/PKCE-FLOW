import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ComponentService {

    reportCountSource = new Subject<number>();
    reportCount$ = this.reportCountSource.asObservable();

    constructor() {}

    updateReportCount() {
        this.reportCountSource.next(1);
    }

}