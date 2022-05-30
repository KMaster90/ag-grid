import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowNodeTransaction, SelectionChangedEvent, SideBarDef
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import {GridClickableButtonComponent} from "./grid-clickable-button/grid-clickable-button.component";
import {TableData, TableRow} from "../model/model";
import {ExcelService} from "./services/excel.service";
import {of, Subject, takeUntil, tap} from "rxjs";
import {FormControl} from "@angular/forms";
@Component({
  selector: 'app-grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  onDestroy$ = new Subject();
  private gridApi!: GridApi;
  context;
  private headerAction = 'Actions';
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('filterTextBox') filterTextBox!: ElementRef<HTMLInputElement>;
  columnsControl = new FormControl()
  columnDefsInitial: ColDef[] = [];
  // Data that gets displayed in the grid
  _tableData!: TableData;
  private isNewImport=false;
  get tableData(){
    return this._tableData;
  }
  @Input() set tableData(value: TableData){
    this._tableData=value;
    this.columnDefs=[];
    Object.keys(value.dataType).forEach(x=>this.columnDefs.push({field:x}))
    this.columnDefs[0] = {...this.columnDefs[0],minWidth: 150, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,checkboxSelection:true};
    this.columnDefs.push({
      headerName: this.headerAction,
      field: this.headerAction,
      cellRenderer: GridClickableButtonComponent,
      colId: 'params',
      editable: false,
      minWidth: 150,
    });
    if(this.isNewImport){
      this.columnDefsInitial = this.columnDefs;
      this.columnsControl.setValue([...this.columnDefsInitial.map(c=>c.field)]);
      this.isNewImport =false
    }

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
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
  };

  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        minWidth: 225,
        width: 225,
        maxWidth: 225,
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
        minWidth: 180,
        maxWidth: 400,
        width: 250,
      },
    ],
    position: 'left',
  };

  constructor(private excelSrv: ExcelService) {
    this.context = { componentParent: this };

  }

  ngOnInit(){
    this.columnDefsInitial = this.columnDefs;
    this.columnsControl.setValue([...this.columnDefsInitial.map(c=>c.field)]);
    console.log(this.columnsControl.value)
    this.columnsControl.valueChanges.pipe(takeUntil(this.onDestroy$), tap(console.log)).subscribe(columnsToShow=>this.columnDefs=this.columnDefsInitial.filter(c=>columnsToShow.indexOf(c.field)>-1));
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

  //---------------EXPORT---------------------

  onBtnExport() {
    this.gridApi.exportDataAsCsv({
      columnKeys: this.columnDefs.filter(h=>h.headerName!==this.headerAction).map(h=>h.field||''),
      onlySelected: !!this.gridApi.getSelectedRows().length,
    });
  }

  //------------TRANSACTION-------------------

  onSelectionChanged($event: SelectionChangedEvent) {
    console.log(this.gridApi.getSelectedRows())

  }

  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.applyTransaction({ remove: selectedData })!;
    this.printResult(res);
  }

  updateItems() {
    const itemsToUpdate: any[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort(function (rowNode, index) {
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

  //-----------------IMPORT------------------

  onImportFile(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;
      const data = <any[]>this.excelSrv.importFromFile(bstr);
      const header: string[] = Object.values(data[0]);
      const importedData = data.slice(1);

      let dataType:any = {};
      header.forEach(h=>dataType[`${h}`]='');

      this.tableData = {
        dataType,
        rowData$ : of(importedData.map(arr => {
          const obj:any = {};
          header.forEach((h,i)=>obj[h] = arr[i]);
          return <TableRow>obj;
        }))
      }

    };
    reader.readAsBinaryString(target.files[0]);
    this.isNewImport =true;
  }

  ngOnDestroy(){
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

}
