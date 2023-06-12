import {Component, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {menus} from "./menu-element";
import {SidemenuItemComponent} from "../sidemenu-item/sidemenu-item.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NgScrollbarModule} from "ngx-scrollbar";

@Component({
  selector: 'ec-sidemenu',
  standalone: true,
  imports: [CommonModule, SidemenuItemComponent, FlexLayoutModule, NgOptimizedImage, NgScrollbarModule],
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent {
  @Input() iconOnly:boolean = false;
  public menus = menus;
}
