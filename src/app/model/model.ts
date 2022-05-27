import {Observable} from "rxjs";

export class Car {
  make = '';
  model = '';
  price = 0;
}

export class Athlete {
  athlete = '';
  age = 0;
  country = '';
  year = 0;
  date = '';
  sport = '';
  gold = 0;
  silver = 0;
  bronze = 0;
  total = 0;
}

export type TableRow = Car | Athlete

export interface TableData{
  rowData$:Observable<TableRow[]>;
  dataType: TableRow;
}
