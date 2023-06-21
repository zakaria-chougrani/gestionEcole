import {Component, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatChipsModule} from "@angular/material/chips";
import {MatGridListModule} from "@angular/material/grid-list";

@Component({
  selector: 'ec-sidemenu-item',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, MatChipsModule, MatGridListModule, RouterLinkActive, NgOptimizedImage],
  templateUrl: './sidemenu-item.component.html',
  styleUrls: ['./sidemenu-item.component.scss']
})
export class SidemenuItemComponent {
  @Input() menu:any;
  @Input() iconOnly: boolean = false;
  @Input() secondaryMenu = false;

  chechForChildMenu() {
    return !!(this.menu && this.menu.sub);
  }
}
