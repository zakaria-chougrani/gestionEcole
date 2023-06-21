import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";

@Component({
  selector: 'ec-user-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FlexLayoutModule, MatIconModule, NgOptimizedImage, MatListModule, MatGridListModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  isOpen: boolean = false;
  @Input() currentUser:any = null;
  Hari:any;
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }
  constructor(private elementRef: ElementRef) { }

}
