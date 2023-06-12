import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FullscreenComponent} from "../fullscreen/fullscreen.component";
import {UserMenuComponent} from "../user-menu/user-menu.component";
import {ToolbarHelpers} from "./toolbar.helpers";

@Component({
  selector: 'ec-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, FlexLayoutModule, FullscreenComponent, UserMenuComponent],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() sidenav:any;
  @Input() sidebar:any;
  @Input() drawer:any;
  @Input() matDrawerShow:any;
  searchOpen: boolean = false;
  toolbarHelpers = ToolbarHelpers;

}
