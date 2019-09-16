import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {MfaUsersDialogComponent} from '../mfa-users/mfa-users-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AppGroupUsersDialogComponent} from './app-group-users-dialog.component';
import {GroupUser} from '../../models/group-user';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss']
})
export class AppUsersComponent implements OnInit, OnChanges {

  @Input() reportsData: {[key: string]: any};
  @Input() reportName: string;
  @Input() org: string;

  chartLabels: string[] = [];
  chartData: number[] = [];
  pieChartType: ChartType = 'pie';
  totalUsers: number;
  noOfGroups: number;
  individualUsers: number;
  noOfGroupUsers: number;
  chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    maintainAspectRatio: false
  };
  modalData: GroupUser;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.resetValues();
    this.setChartData();
  }

  private setChartData() {
    for (let key in this.reportsData) {
      this.chartLabels.push(key);
      this.chartData.push(this.reportsData[key].length);
    }
    this.setDataForAppUserAssignments();
  }

  private setDataForAppUserAssignments() {
    this.totalUsers = this.chartData.reduce((sum, current) => sum + current, 0);
    if(this.chartLabels.includes('Individual')) {
      this.individualUsers = +this.reportsData['Individual'].length;
      this.noOfGroups = this.chartLabels.length - 1;
      this.noOfGroupUsers = this.totalUsers - this.individualUsers;
    } else {
      this.noOfGroups = this.chartLabels.length;
      this.noOfGroupUsers = this.totalUsers;
    }
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
    const dialogRef = this.dialog.open(AppGroupUsersDialogComponent, {
      width: '40%',
      maxWidth: '70%',
      maxHeight: '70%',
      data: this.modalData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.resetValues();
    this.setChartData();
  }

  private resetValues() {
    this.chartLabels = [];
    this.chartData = [];
    this.totalUsers = 0;
    this.individualUsers = 0;
    this.noOfGroups = 0;
    this.noOfGroupUsers = 0;
  }

  private buildModalData(label: string) {
    this.modalData = {groupName: label, users: this.reportsData[label]};
  }
}
