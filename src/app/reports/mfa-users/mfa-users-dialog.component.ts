import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserFactor} from '../../models/user-factor';
import * as XLSX from 'xlsx';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-mfa-users-dialog',
  templateUrl: './mfa-users-dialog.component.html',
  styleUrls: ['./../reports.component.scss']
})
export class MfaUsersDialogComponent implements OnInit {

  @ViewChild('TABLE', {static: false}) table: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dataSource: MatTableDataSource<string>;

  userMFAColumns: string[] = ['userName'];

  constructor(
      public dialogRef: MatDialogRef<MfaUsersDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: UserFactor) {
    this.dataSource = new MatTableDataSource(this.data.users);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  close(): void {
    this.dialogRef.close();
  }

  ExportToExcel() {
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.convertDataToJSON(), {header: ['User']});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.data.factorType.replace(/\s+/g, '-').toLowerCase() + '-users.xlsx');
  }

  private convertDataToJSON() {
    let usersObject = [];
    this.data.users.forEach(item => {
      let obj = {'User': item};
      usersObject.push(obj);
    });
    return usersObject;
  }

  onPaginateChange(event: PageEvent) {
    this.table.nativeElement.scrollTop = 0;
  }
}
