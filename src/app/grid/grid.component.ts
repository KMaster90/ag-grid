import { HttpClient } from '@angular/common/http';
import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams, SelectionChangedEvent
} from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  private gridApi!: GridApi;
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('filterTextBox') filterTextBox!: ElementRef<HTMLInputElement>;
  // Data that gets displayed in the grid
  rowData$!: Observable<any[]>;
  // Each Column Definition results in one Column.
  columnDefs: ColDef[] = [
    { field: 'athlete', minWidth: 150, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,checkboxSelection:true},
    { field: 'age' },
    { field: 'country', minWidth: 150 },
    { field: 'year' },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ];

  // DefaultColDef sets props common to all Columns
  defaultColDef: ColDef = {
    flex:1,
    resizable:true,
    minWidth:100,
    sortable: true,
    filter: true,
  };

  constructor(private http: HttpClient) {}

  // Example load data from sever
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.rowData$=this.http.get<any[]>('https://www.ag-grid.com/example-assets/olympic-winners.json');

  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterTextBox.nativeElement.value);
  }

  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }

  // Example using Grid's API

  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }

  onSelectionChanged($event: SelectionChangedEvent) {
    console.log(this.gridApi.getSelectedRows())

  }
}
