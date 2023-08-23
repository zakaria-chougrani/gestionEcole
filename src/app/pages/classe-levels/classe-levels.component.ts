import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ExtendedModule, FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {Level} from "../../_shared/models/level";
import {ClassLevelService} from "../../_shared/services/class-level.service";
import Swal from "sweetalert2";
import {SchoolClass} from "../../_shared/models/school-class";
import {Router} from "@angular/router";
import {SchoolClassService} from "../../_shared/services/school-class.service";
import {AddLevelComponent} from "../add-level/add-level.component";
import {ColorUtilsService} from "../../_shared/utils/color-utils.service";
import {FonSizeUtilsService} from "../../_shared/utils/fon-size-utils.service";

@Component({
  selector: 'ec-classe-levels',
  standalone: true,
  imports: [CommonModule, ExtendedModule, FlexModule, MatButtonModule, MatDividerModule, MatIconModule, MatPaginatorModule, MatProgressBarModule, MatDialogModule, NgOptimizedImage],
  templateUrl: './classe-levels.component.html',
  styleUrls: ['./classe-levels.component.scss']
})
export class ClasseLevelsComponent implements OnInit {
  levels: Level[] = [];
  totalLevels = 0;
  pageSize = 4;
  currentPage = 0;
  pageSizeOptions: number[] = [4, 8, 12, 25, 50];
  isLoading: boolean = false;
  classDto!: SchoolClass;

  constructor(
    private dialog: MatDialog,
    private schoolClassService: SchoolClassService,
    private classLevelService: ClassLevelService,
    public fonSizeUtilsService: FonSizeUtilsService,
    public colorUtilsService: ColorUtilsService,
    private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state['classDto']) {
      this.classDto = navigation.extras.state['classDto'];
    } else {
      router.navigateByUrl('classes').then();
    }
  }

  ngOnInit(): void {
    if (this.classDto && this.classDto.id) {
      this.loadLevels();
      this.schoolClassService.refreshLevels.subscribe(() => {
        this.loadLevels();
      });
    }
  }

  loadLevels(): void {
    this.schoolClassService.getLevelsBySchoolClass(this.classDto.id, this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.levels = page.content;
          this.totalLevels = page.totalElements;
        },
        error: () => this.isLoading = false,
        complete: () => this.isLoading = false
      });
  }

  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLevels();
  }

  openAddLevelDialog(levelDto: {}) {
    this.dialog.open(AddLevelComponent, {
      width: '600px',
      data: {levelDto: levelDto, classDto: this.classDto},
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
        this.isLoading = true;
        this.classLevelService.deleteLevel(id).subscribe({
          next: () => {
            this.schoolClassService.triggerRefreshLevels();
            Swal.fire('Success', 'Level deleted successfully', 'success').then();
          },
          error: () => this.isLoading = false,
          complete: () => this.isLoading = false
        });
      }
    });
  }

}
