import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FlexModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ProgramSessionService} from "../../_shared/services/program-session.service";
import {ActivatedRoute} from "@angular/router";
import {ProgramService} from "../../_shared/services/program.service";
import Swal from "sweetalert2";
import {QRCodeModule} from "angularx-qrcode";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {Subscription} from "rxjs";
import {ContactInfo, ProgramDto} from "../../_shared/models";
import {ContactService} from "../../_shared/services/contact.service";
import {LastSessionActiveOfProgramDto, StudentSessionDto} from "../../_shared/models";

interface MqttMsg {sessionId?:string;studentId?:string}
@Component({
  selector: 'ec-session-program',
  standalone: true,
  imports: [CommonModule, FlexModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule, QRCodeModule],
  templateUrl: './session-program.component.html',
  styleUrls: ['./session-program.component.scss'],
})
export class SessionProgramComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  noActiveSession: boolean = false;
  students: ContactInfo[] = [];
  programId: string | null = null;
  session!: LastSessionActiveOfProgramDto;
  program!: ProgramDto;
  private subscription!: Subscription;
  private audio!: HTMLAudioElement;
  zoomState: boolean = false;
  qrUrl!: string;
  constructor(
    private sessionService: ProgramSessionService,
    private programService: ProgramService,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private _mqttService: MqttService,
    private _location: Location,
  ) {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
    });

  }

  ngOnInit(): void {
    this.audio = new Audio('../assets/audio/notification.mp3');

    this.loadProgramById();
    this.loadLastSessionActive();
    this.sessionService.refreshProgramSession.subscribe(() => {
      this.loadLastSessionActive();
    });
    this.subscription = this._mqttService.observe(`highup/presence`).subscribe((message: IMqttMessage) => {
      let msg:MqttMsg = JSON.parse(message.payload.toString());
      if (this.session && this.session.id == msg.sessionId){
        this.audio.play().then();
        this.session.students.map(student => {
          if (student.id === msg.studentId) {
            student.present = !student.present;
          }
        });
      }
    });
  }

  loadProgramById() {
    if (!this.programId)
      return;
    this.isLoading = true;
    this.programService.getProgramById(this.programId).subscribe({
      next: program => {
        this.program = program;
        this.contactService.getImage(this.program.teacherId).subscribe({
          next: (imageDto) => {
            if (imageDto.imageByte != null) {
              this.program.teacherImageByte = imageDto.imageByte;
            }
          }
        });
      },
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    });
  }

  loadLastSessionActive() {
    if (!this.programId)
      return;
    this.isLoading = true;
    this.sessionService.getLastSessionActive(this.programId).subscribe({
      next: session => {
        if (!session) {
          this.noActiveSession = true;
        } else {
          this.noActiveSession = false;
          this.session = session;
          if (!this.qrUrl) {
            this.qrUrl = `${window.location.protocol}${window.location.host}/check-presence/${session.id}`;
            if (this.session.students) {
              this.session.students.map(contact => {
                if (contact.id && !contact.imageByte) {
                  this.contactService.getImage(contact.id).subscribe({
                    next: (imageDto) => {
                      if (imageDto.imageByte != null) {
                        contact.imageByte = imageDto.imageByte;
                      }
                    }
                  });
                }
              })
            }
          }
        }
      },
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    })
  }

  public ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }


  createSession() {
    if (!this.programId)
      return;
    this.isLoading = true;
    this.sessionService.createProgramSession(this.programId).subscribe({
      next: session => {
        this.noActiveSession = false;
        this.session = session;
        this.qrUrl = `${window.location.protocol}${window.location.host}/check-presence/${this.session.id}`;
        if (this.session.students) {
          this.session.students.map(student => {
            if (student.id && !student.imageByte) {
              this.contactService.getImage(student.id).subscribe({
                next: (imageDto) => {
                  if (imageDto.imageByte != null) {
                    student.imageByte = imageDto.imageByte;
                  }
                }
              });
            }
          })
        }
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    })
  }

  checkStudent(studentId: string) {
    this.isLoading = true;
    this.sessionService.checkStudent(this.session.id, studentId).subscribe({
      next: () => {
        let mqttMsg:MqttMsg = {sessionId:this.session.id,studentId:studentId};
        this._mqttService.unsafePublish(`highup/presence`, JSON.stringify(mqttMsg), {
          qos: 1,
          retain: true
        });
      },
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    })
  }

  deactivateSession() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactivate it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.sessionService.deactivateSession(this.session.id).subscribe({
          next: () => {
            this.sessionService.triggerRefreshProgramSession();
            let mqttMsg:MqttMsg = {sessionId:this.session.id};
            this._mqttService.unsafePublish(`highup/presence`, JSON.stringify(mqttMsg), {
              qos: 1,
              retain: true
            });
          },
          error: () => this.isLoading = false,
          complete: () => this.isLoading = false
        })
      }
    });

  }

  getCountStudentPresent(students: StudentSessionDto[]): number {
    let cpt = 0;
    students.forEach(value => {
      if (value.present)
        cpt++;
    })
    return cpt;
  }

  toggleZoomState() {
    this.zoomState = !this.zoomState;
  }

  previousPage() {
    this._location.back();
  }


}
