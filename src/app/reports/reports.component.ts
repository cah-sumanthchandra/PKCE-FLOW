import {Component, OnInit} from '@angular/core';
import {IdbService} from '../common/idb-service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  appUserReports: string[] = [];
  userMfaReports: string[] = [];
  showAppUserReport: boolean;
  showMfaReport: boolean;
  reportsData: any;
  reportName: string;
  org: string;
  userReports: any;

  constructor(private idbService: IdbService) {}

  async ngOnInit() {
    this.userReports = await this.idbService.getReports();
    this.userReports.get('mfaUsers').each(report => {
      this.userMfaReports.push(report.reportName);
    });
    this.userReports.get('appUsers').each(report => {
      this.appUserReports.push(report.reportName);
    });
  }

  displayAppUserReport(event: any) {
    const target = event.target.innerText;
    this.userReports.get('appUsers').each(report => {
      if (report.reportName === target) {
        this.reportsData = report.data;
        this.org = target.substring(0, target.indexOf('-'));
        this.reportName = target.substring(target.indexOf('-') + 1, target.length);
        this.showAppUserReport = true;
      }
    });
  }

  clearAllFlags() {
    this.showAppUserReport = false;
    this.showMfaReport = false;
    this.reportsData = null;
  }

  displayUserMfaReport(event) {
    const target = event.target.innerText;
    this.userReports.get('mfaUsers').each(report => {
      if (report.reportName === target) {
        this.reportsData = report.data;
        this.org = target.substring(0, target.indexOf('-'));
        this.showMfaReport = true;
      }
    });
  }
}
