import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'ec-session-program',
  standalone: true,
  imports: [CommonModule, FlexModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule],
  templateUrl: './session-program.component.html',
  styleUrls: ['./session-program.component.scss']
})
export class SessionProgramComponent implements OnInit{
  isLoading: boolean = false;
  noActiveSession:boolean = false;
  students: ContactInfo[] = [];
  programId: string | null = null;
  session!: ProgramSession;
  program!: Program;
  constructor(
    private sessionService:ProgramSessionService,
    private programService:ProgramService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
    });
  }

  ngOnInit(): void {
    this.loadProgramById();
    this.loadLastSessionActive();
    this.sessionService.refreshProgramSession.subscribe(() => {
      this.loadLastSessionActive();
    });
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
      },
      error: err => {
        this.isLoading = false;
        console.error('erreur checkStudent',err);
      },
      complete: () => this.isLoading = false
    })
  }

  closeSession(){

  }

  loadLastSessionActive(){
    this.isLoading = true;
    this.sessionService.getLastSessionActive(this.programId || '').subscribe({
      next: session =>{
        if (!session){
          this.noActiveSession = true;
        }else{
          this.session = session;
          this.noActiveSession = false;
        }
      },
      error: err => {
        this.isLoading = false;
        console.error('erreur loadLastSessionActive',err);
      },
      complete: () => this.isLoading = false
    })
  }

  loadProgramById(){
    if (!this.programId)
      return;
    this.isLoading = true;
    this.programService.getProgramById(this.programId || '').subscribe({
      next: program =>{
        this.program = program;
      },
      error: err => {
        this.isLoading = false;
        console.error('erreur getProgramById',err);
      },
      complete: () => this.isLoading = false
    });
  }

  getStatusStudent(studentPre: ContactInfo):boolean {
    return this.session.students && this.session.students.some(s1 => {
      return studentPre.id === s1.student.id && s1.present;
    });
  }
}
