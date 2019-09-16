import {Component, Input, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {User} from '../../models/user';
import {MatDialog} from '@angular/material/dialog';
import {MfaUsersDialogComponent} from './mfa-users-dialog.component';
import {UserFactor} from '../../models/user-factor';

@Component({
  selector: 'app-mfa-users',
  templateUrl: './mfa-users.component.html',
  styleUrls: ['./mfa-users.component.scss'],

})
export class MfaUsersComponent implements OnInit {

  @Input() reportsData: User[];
  @Input() org: string;

  chartLabels: string[] = [];
  chartData: number[] = [];
  pieChartType: ChartType = 'pie';
  totalUsers: number;
  app: string;
  chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    maintainAspectRatio: false
  };
  usersWithMfaEnrollments: number = 0;
  voiceCallEnrollments: string[] = [];
  smsEnrollments: string[] = [];
  oktaVerifyEnrollments: string[] = [];
  googleAuthenticatorEnrollments: string[] = [];
  oktaVerifyPushEnrollments: string[] = [];
  modalData: UserFactor;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.totalUsers = this.reportsData.length;
    this.setChartLabelsAndData();
  }

  private setChartLabelsAndData() {
    this.chartLabels = ['Voice Call', 'SMS', 'Okta Verify', 'Google Authenticator', 'Okta Verify Push'];
    for(let user of this.reportsData) {
      if(user.factors.length > 0) {
        this.usersWithMfaEnrollments++;
        for(let factor of user.factors) {
          if(factor.factorType === 'sms') {
            this.smsEnrollments.push(user.profile['firstName'] + " " + user.profile['lastName']);
          } else if(factor.factorType === 'token:software:totp' && factor.provider === 'GOOGLE') {
            this.googleAuthenticatorEnrollments.push(user.profile['firstName'] + " " + user.profile['lastName']);
          } else if(factor.factorType === 'token:software:totp' && factor.provider === 'OKTA') {
            this.oktaVerifyEnrollments.push(user.profile['firstName'] + " " + user.profile['lastName']);
          } else if(factor.factorType === 'push' && factor.provider === 'OKTA') {
            this.oktaVerifyPushEnrollments.push(user.profile['firstName'] + " " + user.profile['lastName']);
          } else if(factor.factorType ==='call') {
            this.voiceCallEnrollments.push(user.profile['firstName'] + " " + user.profile['lastName']);
          } else {
            console.log('Unknown factor:::' + factor.factorType);
          }
        }
      }
    }
    this.chartData.push(this.voiceCallEnrollments.length,
        this.smsEnrollments.length,
        this.oktaVerifyEnrollments.length,
        this.googleAuthenticatorEnrollments.length,
        this.oktaVerifyPushEnrollments.length);
  }

  onChartClick(e: any) {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if ( activePoints.length > 0) {
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        this.openDialog(label);
      }
    }
  }

  openDialog(label: string): void {
    this.buildModalData(label);
    const dialogRef = this.dialog.open(MfaUsersDialogComponent, {
      width: '40%',
      maxWidth: '70%',
      maxHeight: '70%',
      data: this.modalData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  private buildModalData(label: string) {
    switch(label) {
      case 'SMS': {
        this.modalData = { factorType: label, users: this.smsEnrollments };
        break;
      }
      case 'Okta Verify': {
        this.modalData = { factorType: label, users: this.oktaVerifyEnrollments };
        break;
      }
      case 'Google Authenticator': {
        this.modalData = { factorType: label, users: this.googleAuthenticatorEnrollments };
        break;
      }
      case 'Okta Verify Push': {
        this.modalData = { factorType: label, users: this.oktaVerifyPushEnrollments };
        break;
      }
      case 'Voice Call': {
        this.modalData = { factorType: label, users: this.voiceCallEnrollments };
        break;
      }
      default: {
        console.log('Not a valid factor');
        break;
      }
    }
  }
}
