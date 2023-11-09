import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UtilsService} from "../../_shared/utils/utils.service";
import {Attendance} from "../../_shared/models";

@Component({
  selector: 'ec-montly-list-presence-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './montly-list-presence-print.component.html',
  styles: []
})
export class MontlyListPresencePrintComponent implements AfterViewInit,OnInit {
  @ViewChild('page') page!: ElementRef;
  @ViewChild('printFrame', {static: false}) printFrame!: ElementRef<HTMLIFrameElement>;
  today: Date = new Date();
  months: { value: number, name: string }[] = [
    {value: 0, name: 'January'},
    {value: 1, name: 'February'},
    {value: 2, name: 'March'},
    {value: 3, name: 'April'},
    {value: 4, name: 'May'},
    {value: 5, name: 'June'},
    {value: 6, name: 'July'},
    {value: 7, name: 'August'},
    {value: 8, name: 'September'},
    {value: 9, name: 'October'},
    {value: 10, name: 'November'},
    {value: 11, name: 'December'}
  ];
  month: { value: number, name: string } | null = null;

  constructor(
    public dialogRef: MatDialogRef<MontlyListPresencePrintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public utilsService: UtilsService
  ) {
  }
  ngOnInit(): void {
    this.month = this.months.find(value => value.value == this.data.monthValue) || null;

  }
  ngAfterViewInit(): void {
    this.print();
  }

  isDayPresent(attendances: Attendance[], dayNumber: number) {
    let className = 'not-day-icon';
    attendances.forEach(attendance => {
      let dateTocheck = new Date(attendance.date);
      if (dateTocheck.getUTCDate() === dayNumber) {
        if (attendance.presentStatus) {
          className = 'checked-icon';
        } else {
          className = 'unchecked-icon';
        }
      }
    })
    return className;
  }

  print() {
    const styleContent = `
        <style>
          @page {
            size: landscape;
          }

        .table-container{
          overflow: auto;
        }
        .attendance-table {
          border: 1px solid #000;
          border-collapse: collapse;
          width: 100%;
        }
        .attendance-table th, .attendance-table td {
            border: 1px solid #000;
            padding: 8px;
        }
        .gray-bg {
          background-color: #4b4b4b;
          color: white;
        }
        p{
          font-size: .8rem;
        }
        .checked-icon::before {
          content: '\\2713';
          color: green;
          font-size: 24px;
        }
        .unchecked-icon::before {
          content: '\\2717';
          color: red;
          font-size: 24px;
        }

        .not-day-icon::before {
          content: '-';
          color: grey;
          font-size: 24px;
        }
        .text-center{
            text-align: center;
        }
        </style>
    `;
    this.utilsService.printPage(this.page, this.printFrame, this.dialogRef, styleContent);
  }


}
