import { Component } from '@angular/core';
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background: ThemePalette = "primary";

}
