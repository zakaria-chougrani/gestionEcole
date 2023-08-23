import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {ContactInfo} from "../../_shared/models/contact-info";
import {ProgramSessionService} from "../../_shared/services/program-session.service";
import {ActivatedRoute} from "@angular/router";
import {ProgramSession} from "../../_shared/models/program-session";
import {Program} from "../../_shared/models/program";
import {ProgramService} from "../../_shared/services/program.service";
import Swal from "sweetalert2";
import {QRCodeModule} from "angularx-qrcode";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {Subscription} from "rxjs";
import {Session} from "../../_shared/models/session";
import {StudentPresence} from "../../_shared/models/student-presence";



@Component({
  selector: 'ec-session-program',
  standalone: true,
  imports: [CommonModule, FlexModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule, QRCodeModule],
  templateUrl: './session-program.component.html',
  styleUrls: ['./session-program.component.scss'],
})
export class SessionProgramComponent implements OnInit,OnDestroy{
  isLoading: boolean = false;
  noActiveSession:boolean = false;
  students: ContactInfo[] = [];
  programId: string | null = null;
  session!: ProgramSession;
  program!: Program;
  private subscription!: Subscription;
  private audio!: HTMLAudioElement;
  zoomState: boolean = false;

  constructor(
    private sessionService:ProgramSessionService,
    private programService:ProgramService,
    private route: ActivatedRoute,
    private _mqttService: MqttService

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
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  createSession() {
    this.isLoading = true;
    this.sessionService.createProgramSession(this.programId || '').subscribe({
      next: () =>{
        this.sessionService.triggerRefreshProgramSession();
      },
      error: err => {
        this.isLoading = false;
        console.error('erreur createProgramSession',err);
      },
      complete: () => this.isLoading = false
    })
  }

  checkStudent(studentId:string){
    this.isLoading = true;
    this.sessionService.checkStudent(this.session.id,studentId).subscribe({
      next: () =>{
        this.sessionService.triggerRefreshProgramSession();
        this._mqttService.unsafePublish(`highup/presence/${this.session.id}`, 'true', {qos: 1, retain: true});
      },
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    })
  }

  deactivateSession(){
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
          next: () =>{
            this.sessionService.triggerRefreshProgramSession();
            this._mqttService.unsafePublish(`highup/presence/${this.session.id}`, 'true', {qos: 1, retain: true});
          },
          error: () => this.isLoading = false,
          complete: () => this.isLoading = false
        })
      }
    });

  }

  loadLastSessionActive(){
    this.isLoading = true;
    this.sessionService.getLastSessionActive(this.programId || '').subscribe({
      next: session =>{
        if (!session){
          this.noActiveSession = true;

        }else{
          this.session = session;
          this.subscription = this._mqttService.observe(`highup/presence/${this.session.id}`).subscribe((message: IMqttMessage) => {
            // console.log(message.payload.toString());

            this.sessionService.triggerRefreshProgramSession();
            this.audio.play().then();
          });
          this.noActiveSession = false;
        }
      },
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    })
  }

  loadProgramById(){
    if (!this.programId)
      return;
    this.isLoading = true;
    this.programService.getProgramById(this.programId || '').subscribe({
      next: program =>this.program = program,
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    });
  }

  getStatusStudent(studentPre: ContactInfo):boolean {
    return this.session.students && this.session.students.some(s1 => {
      return studentPre.id === s1.student.id && s1.present;
    });
  }
  getCountStudentPresent(students:StudentPresence[]):number{
    let cpt = 0;
    students.forEach(value => {
      if (value.present)
        cpt++;
    })
    return cpt;
  }
  getCurrentUrl(): string {
    return `${window.location.protocol}${window.location.host}/check-presence/${this.session ? this.session.id : ''}`;
  }

  toggleZoomState() {
    this.zoomState = !this.zoomState;
  }
}
