import { Component } from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {ProgramSessionService} from "../../_shared/services/program-session.service";

@Component({
  selector: 'ec-students-presence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-presence.component.html',
  styleUrls: ['./students-presence.component.scss']
})
export class StudentsPresenceComponent {
  students: any[] = [];
  weeks: { title: string; days: {weekNumber: number, dayNumber: number}[] }[] = [];
  daysInCurrentMonth: { weekNumber: number; dayNumber: number }[] = [];
  programId: string | null = null;

  constructor(
    private _location: Location,
    private programSessionService: ProgramSessionService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
    });
  }
  ngOnInit(): void {
    this.students = [
      { id: 1, name: 'Student 1', attendance: [] },
      { id: 2, name: 'Student 2', attendance: [] }
    ];
    this.generateDaysInCurrentMonth();
    this.groupDaysIntoWeeks();
  }

  loadStudent(){

  }
  private generateDaysInCurrentMonth(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    let currentWeek = 1;

    for (let day = 1; day <= lastDay; day++) {
      this.daysInCurrentMonth.push({ weekNumber: currentWeek, dayNumber: day });

      if ((day + firstDayOfWeek - 1) % 7 === 0) {
        currentWeek++;
      }
    }
  }

  private groupDaysIntoWeeks(): void {
    this.weeks = [];

    for (let i = 1; i <= this.daysInCurrentMonth.length; i += 7) {
      const weekDays = this.daysInCurrentMonth.slice(i - 1, i + 6);
      const weekTitle = `Week ${weekDays[0].weekNumber}`;
      this.weeks.push({ title: weekTitle, days: weekDays });
    }
  }
  isDayPresent(student: any, dayNumber: number): boolean {
    const attendanceIndex = dayNumber - 1;
    return student.attendance[attendanceIndex];
  }
}
