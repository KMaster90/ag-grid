import { HttpClient } from '@angular/common/http';
import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowNodeTransaction, SelectionChangedEvent
} from 'ag-grid-community';
import {GridClickableButtonComponent} from "./grid-clickable-button/grid-clickable-button.component";
import {TableData} from "../model/model";

@Component({
  selector: 'app-grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  private gridApi!: GridApi;
  context;
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('filterTextBox') filterTextBox!: ElementRef<HTMLInputElement>;

  // Data that gets displayed in the grid
  _tableData!: TableData;
  get tableData(){
    return this._tableData;
  }
  @Input() set tableData(value: TableData){
    this._tableData=value;
    this.columnDefs=[];
    Object.keys(value.dataType).forEach(x=>this.columnDefs.push({field:x}))

    this.columnDefs[0] = {...this.columnDefs[0],minWidth: 150, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,checkboxSelection:true};
    this.columnDefs.push({
      headerName: 'Actions',
      field: 'value',
      cellRenderer: GridClickableButtonComponent,
      colId: 'params',
      editable: false,
      minWidth: 150,
    });
    console.log(this.columnDefs)

  }

  // Each Column Definition results in one Column.
  columnDefs: ColDef[] = [];

  // DefaultColDef sets props common to all Columns
  defaultColDef: ColDef = {
    flex:1,
    resizable:true,
    minWidth:100,
    sortable: true,
    filter: true,
  };

  constructor() {
    this.context = { componentParent: this };
  }

  ngOnInit(){

  }

  // Example load data from sever
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterTextBox.nativeElement.value);
  }

  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }

  onBtnExport() {
    this.gridApi.exportDataAsCsv({onlySelected:!!this.gridApi.getSelectedRows().length});
  }

  onSelectionChanged($event: SelectionChangedEvent) {
    console.log(this.gridApi.getSelectedRows())

  }

  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.applyTransaction({ remove: selectedData })!;
    this.printResult(res);
  }

  updateItems() {
    // update the first 2 items
    const itemsToUpdate: any[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort(function (rowNode, index) {
      // only do first 2
      if (rowNode.isSelected() === false) {
        return;
      }
      const data = rowNode.data;
      data.age = Math.floor(Math.random() * 20000 + 20000);
      itemsToUpdate.push(data);
    });
    const res = this.gridApi.applyTransaction({ update: itemsToUpdate })!;
    this.printResult(res);
  }

  printResult(res: RowNodeTransaction) {
    console.log('---------------------------------------');
    if (res.add) {
      res.add.forEach(function (rowNode) {
        console.log('Added Row Node', rowNode);
      });
    }
    if (res.remove) {
      res.remove.forEach(function (rowNode) {
        console.log('Removed Row Node', rowNode);
      });
    }
    if (res.update) {
      res.update.forEach(function (rowNode) {
        console.log('Updated Row Node', rowNode);
      });
    }
  }
}
