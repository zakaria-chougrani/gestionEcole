import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {FlexModule} from "@angular/flex-layout";
import {ContactInfo} from "../../_shared/models";
import {EditContactComponent} from "../edit-contact/edit-contact.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {ContactService} from "../../_shared/services/contact.service";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {StatusEnum, TaskEnum} from "../../_shared/enum";
import {MatSelectModule} from "@angular/material/select";


@Component({
  selector: 'ec-contact',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatChipsModule, FlexModule, NgOptimizedImage, EditContactComponent, MatDialogModule, MatPaginatorModule, FormsModule, MatProgressBarModule, MatSelectModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  isLoading: boolean = false;
  contacts: ContactInfo[] = [];
  totalContacts = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  searchValue = '';
  statusList: StatusEnum[] = [StatusEnum.ACTIVE, StatusEnum.DEL, StatusEnum.ALL];
  statusOption: StatusEnum = StatusEnum.ACTIVE;
  isError: Boolean = false;
  protected readonly StatusEnum = StatusEnum;
  protected readonly TaskEnum = TaskEnum;
  taskOption: TaskEnum = TaskEnum.ALL;
  taskList: TaskEnum[] = [TaskEnum.ALL,TaskEnum.Staff, TaskEnum.Teacher, TaskEnum.Student,TaskEnum.trainee_staff,TaskEnum.trainee_student];
  constructor(private dialog: MatDialog, private contactService: ContactService) {
  }

  ngOnInit(): void {
    this.loadContacts();
    this.contactService.refreshContacts.subscribe(() => {
      this.loadContacts();
    });
  }

  loadContacts(): void {
    this.isError = false;
    this.isLoading = true;
    this.contacts = [];
    this.contactService.getAllContacts(this.currentPage, this.pageSize, this.searchValue, this.taskOption, this.statusOption)
      .subscribe({
        next: (page) => {
          this.contacts = page.content;
          this.totalContacts = page.totalElements;
          this.loadContactsImage();
        },
        error: () => {
          this.isError = true;
          this.isLoading = false;
        },
        complete: () => this.isLoading = false
      });
  }


  loadContactsImage() {
    this.contacts.forEach(contact => {
      if (contact.id && !contact.imageByte){
        this.contactService.getImage(contact.id )
          .subscribe({
            next: (value) => {
              this.contacts.map((contactImage) => {
                if (contactImage.id === contact.id ) {
                  contactImage.imageByte = value.imageByte;
                }
              });
            }
          });
      }
    })
  }

  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  search(): void {
    this.loadContacts();
  }

  openAddContactDialog(contact: ContactInfo) {
    let dialogRef = this.dialog.open(EditContactComponent, {
      width: '600px',
      data: contact,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.triggerRefreshContacts();
      }
    });

  }

  deleteItem(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isError = false;
        this.isLoading = true;
        this.contactService.deleteContact(id).subscribe({
          next: () => {
            this.contactService.triggerRefreshContacts();
            Swal.fire('Success', 'Contact deleted successfully', 'success').then();
          },
          error: () => {
            this.isError = true;
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }


  recoverItem(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, recover it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isError = false;
        this.isLoading = true;
        this.contactService.recoverContact(id).subscribe({
          next: () => {
            this.contactService.triggerRefreshContacts();
            Swal.fire('Success', 'Contact recover successfully', 'success').then();
          },
          error: () => {
            this.isError = true;
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }


}
