import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";
import {MatLegacyListModule} from "@angular/material/legacy-list";

@Component({
  selector: 'ec-sidemenu-item',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, MatLegacyChipsModule, MatLegacyListModule],
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
