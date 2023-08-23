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
import {ContactInfo} from "../../_shared/models/contact-info";
import {EditContactComponent} from "../edit-contact/edit-contact.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {ContactService} from "../../_shared/services/contact.service";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {MatProgressBarModule} from "@angular/material/progress-bar";


@Component({
  selector: 'ec-contact',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatChipsModule, FlexModule, NgOptimizedImage, EditContactComponent, MatDialogModule, MatPaginatorModule, FormsModule, MatProgressBarModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private dialog: MatDialog, private contactService: ContactService) {
  }

  contacts: ContactInfo[] = [];
  totalContacts = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  searchValue = '';

  ngOnInit(): void {
    this.loadContacts();
    this.contactService.refreshContacts.subscribe(() => {
      this.loadContacts();
    });
  }

  loadContacts(): void {
    this.isLoading = true;
    this.contactService.getAllContacts(this.currentPage, this.pageSize, this.searchValue)
      .subscribe({
        next: (page) => {
          this.contacts = page.content;
          this.totalContacts = page.totalElements;
        },
        error: () => this.isLoading = false,
        complete: () => this.isLoading = false
      });
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
    this.dialog.open(EditContactComponent, {
      width: '600px',
      data: contact,
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
        // User confirmed the deletion, proceed with the delete operation
        this.isLoading = true;
        this.contactService.deleteContact(id).subscribe({
          next: () => {
            this.contactService.triggerRefreshContacts();
            Swal.fire('Success', 'Class deleted successfully', 'success').then();
          },
          error: () => this.isLoading = false,
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }
}
