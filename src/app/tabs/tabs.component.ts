import { Component } from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {HttpClient} from "@angular/common/http";
import {Athlete, Car, TableData} from "../model/model";
import {MatTabChangeEvent} from "@angular/material/tabs";

const aziendeURl = 'https://www.ag-grid.com/example-assets/row-data.json'
const privatiUrl = 'https://www.ag-grid.com/example-assets/olympic-winners.json'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
  background: ThemePalette = "primary";

  tableData: TableData[] = [
    {
    rowData$:this.http.get<Athlete[]>(privatiUrl),
    dataType:new Athlete()
    },
    {
      rowData$: this.http.get<Car[]>(aziendeURl),
      dataType: new Car()
    }
  ];

  tabs= {
    firstTabLabel:'PRIVATI',
    secondTabLabel: 'AZIENDE'
  };

  constructor(public http: HttpClient) {  }

}
