import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import * as moment from 'moment';
import {CalendarEvent, CalendarWeekModule, DAYS_OF_WEEK} from "angular-calendar";
import {ProgramService} from "../../_shared/services/program.service";
import {ProgramDto} from "../../_shared/models";
import {ColorUtilsService} from "../../_shared/utils/color-utils.service";


@Component({
  selector: 'ec-schedule',
  standalone: true,
  imports: [CommonModule, CalendarWeekModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  viewDate: Date = moment().toDate(); // Start of the current week
  hourSegments: number = 2;
  excludeDays: number[] = [0];

  weekStartsOn = DAYS_OF_WEEK.MONDAY;
  events: CalendarEvent[] = [];

  constructor(private programService: ProgramService, private cdr: ChangeDetectorRef,private colorUtilsService:ColorUtilsService) {
  }

  eventClicked(event: any): void {
    // Handle event click
    console.log('Event clicked:', event);
  }

  ngOnInit(): void {
    this.programService.getProgramsSchedule().subscribe(data => {
      data.forEach(value => this.convertSessionsToEvents(value))
    })
  }

  convertSessionsToEvents(program: ProgramDto) {
    const randomColor = this.colorUtilsService.getRandomColor();
    const textColor = this.colorUtilsService.getContrastingTextColor(randomColor);
    program.sessions.forEach((session: any) => {
      const startDateTime = moment().day(this.getDayFromName(session.day)).set({
        hour: parseInt(session.startOfSession.split(':')[0]),
        minute: parseInt(session.startOfSession.split(':')[1])
      });
      const endDateTime = moment().day(this.getDayFromName(session.day)).set({
        hour: parseInt(session.endOfSession.split(':')[0]),
        minute: parseInt(session.endOfSession.split(':')[1])
      });

      this.events.push({
        title: `
                <div >
                  <h5 class="text-center">${program.title.toUpperCase()} -- At: ${session.startOfSession} to ${session.endOfSession}</h5>
                  <hr>
                  <h6>Teacher: ${program.teacherFullName.toUpperCase()}</h6>
                  <h6>Class: ${program.classLevel.schoolClass.name}</h6>
                  <h6>Level: ${program.classLevel.name}</h6>
                </div>
          `,
        start: startDateTime.toDate(),
        end: endDateTime.toDate(),
        color:{primary:'white',secondary:randomColor,secondaryText:textColor}
      });
    });
    this.refresh();
  }

  getDayFromName(dayName: string): number {
    switch (dayName) {
      case 'MONDAY':
        return 1;
      case 'TUESDAY':
        return 2;
      case 'WEDNESDAY':
        return 3;
      case 'THURSDAY':
        return 4;
      case 'FRIDAY':
        return 5;
      case 'SATURDAY':
        return 6;
      case 'SUNDAY':
        return 7;
      default:
        return -1; // Invalid day name
    }
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}

