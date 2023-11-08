import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ProgramSessionService} from "../../_shared/services/program-session.service";
import {Attendance, ProgramDto, StudentPresence} from "../../_shared/models";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import * as moment from 'moment';
import {MatButtonModule} from "@angular/material/button";
import {ProgramService} from "../../_shared/services/program.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
  MontlyListPresencePrintComponent
} from "../../print/montly-list-presence-print/montly-list-presence-print.component";

@Component({
  selector: 'ec-students-presence',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatOptionModule, MatSelectModule, FormsModule, MatButtonModule, MatDialogModule, RouterLink],
  templateUrl: './students-presence.component.html',
  styleUrls: ['./students-presence.component.scss']
})
export class StudentsPresenceComponent {
  programDto!: ProgramDto;
  studentPresences: StudentPresence[] = [];
  weeks: { title: string; days: { weekNumber: number, dayNumber: number }[] }[] = [];
  daysInCurrentMonth: { weekNumber: number; dayNumber: number }[] = [];
  programId: string | null = null;
  yearValue: number = (new Date()).getUTCFullYear();
  yearList: number[] = this.generateYearList(2022, this.yearValue);
  monthValue: number = (new Date()).getUTCMonth();
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

  constructor(
    public dialog: MatDialog,
    private programSessionService: ProgramSessionService,
    private programService: ProgramService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
    });
  }

  ngOnInit(): void {
    this.loadProgram();
    this.loadData();
    this.generateDaysAndWeek();
  }

  loadProgram() {
    if (this.programId) {
      this.programService.getProgramById(this.programId).subscribe({
        next: value => {
          this.programDto = value;
        }
      })
    }
  }

  loadData() {
    if (this.programId) {
      this.programSessionService.getAllStudentsPresenceOfProgram(this.programId, this.yearValue.toString(), (this.monthValue + 1).toString()).subscribe(data => {
        this.studentPresences = data;
        this.studentPresences = this.studentPresences.map(value => {
          value.attendances = this.retrieveLastRecordForEachDay(value.attendances);
          return value;
        });
      });
    }
  }

  generateDaysAndWeek() {
    this.daysInCurrentMonth = [];
    this.weeks = [];

    const startDate = moment({year: this.yearValue, month: this.monthValue, day: 1});
    const endDate = startDate.clone().endOf('month');
    let currentWeek = 1;
    for (let day = 1; day <= endDate.date(); day++) {
      this.daysInCurrentMonth.push({weekNumber: currentWeek, dayNumber: day});
      if ((day + startDate.date() - 1) % 7 === 0) {
        currentWeek++;
      }
    }

    for (let i = 1; i <= this.daysInCurrentMonth.length; i += 7) {
      const weekDays = this.daysInCurrentMonth.slice(i - 1, i + 6);
      const weekTitle = `Week ${weekDays[0].weekNumber}`;
      this.weeks.push({title: weekTitle, days: weekDays});
    }
  }

  generateYearList(startYear: number, endYear: number): number[] {
    const years: number[] = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= startYear && year <= endYear; year--) {
      years.push(year);
    }
    return years;
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

  retrieveLastRecordForEachDay(attendances: Attendance[]): Attendance[] {
    const sortedData = attendances.sort((a, b) => (a.date > b.date ? -1 : 1));
    const lastRecordsForEachDay: Attendance[] = [];
    const uniqueDates = new Set();

    for (const item of sortedData) {
      const date = new Date(item.date).toISOString().slice(0, 10); // Extract the date part only

      if (!uniqueDates.has(date)) {
        lastRecordsForEachDay.push(item);
        uniqueDates.add(date);
      }
    }
    return lastRecordsForEachDay;
  }

  print() {
    this.dialog.open(MontlyListPresencePrintComponent, {
      width: '21cm',
      height: '29.7cm',
      data: {
        yearValue: this.yearValue,
        monthValue: this.monthValue,
        weeks: this.weeks,
        daysInCurrentMonth: this.daysInCurrentMonth,
        programDto: this.programDto,
        studentPresences: this.studentPresences
      }
    });
  }
}
