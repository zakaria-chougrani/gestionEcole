import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import * as moment from 'moment';
import {CalendarEvent, CalendarWeekModule, DAYS_OF_WEEK} from "angular-calendar";
import {ProgramService} from "../../_shared/services/program.service";
import {ContactInfo, ProgramDto} from "../../_shared/models";
import {ColorUtilsService} from "../../_shared/utils/color-utils.service";
import {FormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {ContactService} from "../../_shared/services/contact.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {Router} from "@angular/router";


@Component({
  selector: 'ec-schedule',
  standalone: true,
  imports: [CommonModule, CalendarWeekModule, FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  viewDate: Date = moment().toDate(); // Start of the current week
  hourSegments: number = 2;

  events: CalendarEvent[] = [];
  programs: ProgramDto[] = [];
  teacherSearch: string = '';
  teachers: ContactInfo[] = [];
  isLoading: boolean = false;


  constructor(
    private contactService: ContactService,
    private programService: ProgramService,
    private cdr: ChangeDetectorRef,
    private colorUtilsService: ColorUtilsService,
    private router:Router
  ) {
  }

  eventClicked(event: any): void {
    this.router.navigateByUrl(`/history-sessions/${event.meta.programId}/students-presence`).then();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.programService.getProgramsSchedule().subscribe(
      {
        next: data => {
          this.programs = data;
          this.filtrePrograms(null);

          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    this.loadTeachers();

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

  loadTeachers(): void {
    this.isLoading = true;
    this.teachers = [];
    this.contactService.getActiveTeachersBySearchValue(0, 20, this.teacherSearch || '')
      .subscribe({
        next: (page) => {
          this.teachers = page.content;
          if (this.teachers.length) {
            this.teachers.map(teacher => {
              if (teacher.id) {
                this.contactService.getImage(teacher.id).subscribe({
                  next: (imageDto) => teacher.imageByte = imageDto.imageByte
                });
              }
            });
          }
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  filtrePrograms(event: any) {
    let filtredPrograms: ProgramDto[] = this.programs;

    if (event && event.option.value) {
      let currentTeacher: ContactInfo = event.option.value;
      filtredPrograms = filtredPrograms.filter(item => item.teacherId === currentTeacher.id);
    }
    this.events = [];
    filtredPrograms.forEach(value => {
      this.convertSessionsToEvents(value);
    });
    this.refresh();
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
                  <p>Teacher: ${program.teacherFullName.toUpperCase()}</p>
                  <p>Class: ${program.classLevel.schoolClass.name} -- Level: ${program.classLevel.name}</p>
                </div>
          `,
        start: startDateTime.toDate(),
        end: endDateTime.toDate(),
        color: {primary: 'white', secondary: randomColor, secondaryText: textColor},
        meta: {
          programId: program.id
        }
      });
    });
  }

  displayTeacherFn(teacher: ContactInfo): string {
    return teacher && teacher.lastName && teacher.firstName ? teacher.lastName.toUpperCase() + ' ' + teacher.firstName.toLowerCase() : '';
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }


}

