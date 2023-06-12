import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatDrawerMode, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidemenuComponent} from "../core/sidemenu/sidemenu.component";
import {ToolbarComponent} from "../core/toolbar/toolbar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'ec-auth',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatToolbarModule, SidemenuComponent, ToolbarComponent, RouterOutlet, NgOptimizedImage],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  sideNavOpened: boolean = true;
  matDrawerOpened: boolean = false;
  matDrawerShow: boolean = true;

  sideNavMode: MatDrawerMode = 'side';

}
