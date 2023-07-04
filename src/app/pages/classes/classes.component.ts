import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AddClassComponent} from "../add-class/add-class.component";
import {SchoolClass} from "../../_shared/models/school-class";
import {SchoolClassService} from "../../_shared/services/school-class.service";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import Swal from 'sweetalert2';
import {Router} from "@angular/router";

@Component({
  selector: 'ec-classes',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, MatDividerModule, MatButtonModule, NgOptimizedImage, MatDialogModule, MatPaginatorModule, MatIconModule, MatProgressBarModule],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  classes: SchoolClass[] = [];
  totalContacts = 0;
  pageSize = 4;
  currentPage = 0;
  pageSizeOptions: number[] = [4, 8, 12, 25, 50];
  isLoading: boolean = false;

  constructor(private dialog: MatDialog, private schoolClassService: SchoolClassService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadClasses();
    this.schoolClassService.refreshSchoolClass.subscribe(() => {
      this.loadClasses();
    });
  }

  loadClasses(): void {
    this.schoolClassService.getAllClasses(this.currentPage, this.pageSize)
      .subscribe((page) => {
        this.classes = page.content;
        this.totalContacts = page.totalElements;
      });
  }

  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClasses();
  }

  openAddClassDialog(classDto: {}) {
    this.dialog.open(AddClassComponent, {
      width: '600px',
      data: classDto,
    });
  }

  navigateToLevels(classDto: SchoolClass) {
    this.router.navigateByUrl('/levels', {state: {classDto: classDto}}).then();
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
        this.schoolClassService.deleteClass(id).subscribe({
          next: () => {
            this.schoolClassService.triggerRefreshSchoolClass();
            Swal.fire('Success', 'Class deleted successfully', 'success').then();
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }
}
