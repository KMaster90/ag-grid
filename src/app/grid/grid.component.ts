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
  IGetRowsParams
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
    // this row shows the row index, doesn't use any data from the row
    {
      headerName: 'ID',
      maxWidth: 100,
      // it is important to have node.id here, so that when the id changes (which happens
      // when the row is loaded) then the cell is refreshed.
      valueGetter: 'node.id',
      cellRenderer: (params: ICellRendererParams) => {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },

    },
    { field: 'athlete', minWidth: 150 },
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
}
