import { Component } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'app-grid-clickable-button',
  templateUrl: './grid-clickable-button.component.html',
  styleUrls: ['./grid-clickable-button.component.css']
})
export class GridClickableButtonComponent implements ICellRendererAngularComp {

  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  refresh(): boolean {
    return false;
  }

  updateItems() {
    setTimeout(()=>this.params.context.componentParent.updateItems())
  }

  onRemoveSelected($event: any) {
    setTimeout(()=>this.params.context.componentParent.onRemoveSelected())
  }


  preventSelection($event: MouseEvent) {
    console.log('child',$event)
    if(!!this.params.context.componentParent.gridApi.getSelectedRows().length)
    $event.stopPropagation();
  }


}
