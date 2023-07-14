import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Leaves } from './models/leaves.model';
import { MyLeavesService } from './my-leaves.service';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate } from '@angular/common';
import { LeaveStatus } from './models/leaveStatus';

@Component({
  selector: 'app-my-leaves',
  templateUrl: './my-leaves.component.html',
  styleUrls: ['./my-leaves.component.scss'],
})
export class MyLeavesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    'id',
    'startDate',
    'endDate',
    'createdAt',
    'nbr_days',
    'leaveType',
    'leaveStatus',
    'comment',
    'actions'
  ];

  exampleDatabase?: MyLeavesService | null;
  // dataSource!: ExampleDataSource;
  dataSource = new Array<Leaves>;
  selection = new SelectionModel<Leaves>(true, []);
  id?: number;
  index?: number;
  Leaves?: Leaves | null;
  isCancel = false;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public myLeavesService: MyLeavesService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    console.log(this.Leaves);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        Leaves: this.Leaves,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.loadData();
        this.showNotification(
          'snackbar-success',
          'Leave added Successfully',
          'bottom',
          'center'
        );
      }
    });
  }
  editCall(row: Leaves) {
    console.log("test");
    this.id = row.id;
    console.log(this.id);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        Leaves: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 1) {
        this.loadData();
        this.showNotification(
          'black',
          'Leave updated Successfully',
          'bottom',
          'center'
        );
      }
    });
  }

  deleteItem(i: number, row: Leaves) {
    this.index = i;
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
      this.isCancel = true;
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        height: '270px',
        width: '300px',
        data: {
          Leaves: row,
          action: 'cancel',
        },
        direction: tempDirection,
      });
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.loadData();
        }
      });

  }
  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //  // const numRows = this.dataSource.renderedData.length;
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected()
  //     ? this.selection.clear()
  //     : this.dataSource.renderedData.forEach((row) =>
  //         this.selection.select(row)
  //       );
  // }
  // removeSelectedRows() {
  //   const totalSelect = this.selection.selected.length;
  //   this.selection.selected.forEach((item) => {
  //     const index: number = this.dataSource.renderedData.findIndex(
  //       (d) => d === item
  //     );
  //     // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
  //     this.exampleDatabase?.dataChange.value.splice(index, 1);
  //     this.refreshTable();
  //     this.selection = new SelectionModel<Leaves>(true, []);
  //   });
  //   this.showNotification(
  //     'snackbar-danger',
  //     totalSelect + ' Record Delete Successfully...!!!',
  //     'bottom',
  //     'center'
  //   );
  // }
  //  public loadData() {
  //    this.exampleDatabase = new MyLeavesService(this.httpClient);
  //    this.dataSource = new ExampleDataSource(
  //      this.exampleDatabase,
  //      this.paginator,
  //      this.sort
  //    );
  //    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
  //      () => {
  //        if (!this.dataSource) {
  //          return;
  //        }
  //        this.dataSource.filter = this.filter.nativeElement.value;
  //      }
  //    );
  //  }

  public loadData() {
    console.log()
    this.myLeavesService.getAllMyLeaves().subscribe((leaves) => {
      this.dataSource = leaves;
      console.log(leaves);
    });
  }


  // export table data in excel file
  // exportExcel() {
  //   // key name with space add in brackets
  //   const exportData: Partial<TableElement>[] =
  //     this.dataSource.filteredData.map((x) => ({
  //       'Apply Date':
  //         formatDate(new Date(x.applyDate), 'yyyy-MM-dd', 'en') || '',
  //       'From Date': formatDate(new Date(x.fromDate), 'yyyy-MM-dd', 'en') || '',
  //       'To Date': formatDate(new Date(x.toDate), 'yyyy-MM-dd', 'en') || '',
  //       'Half Day': x.halfDay,
  //       Type: x.type,
  //       Status: x.status,
  //       Reason: x.reason,
  //     }));

  //   TableExportUtil.exportToExcel(exportData, 'excel');
  // }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  // context menu
  onContextMenu(event: MouseEvent, item: Leaves) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}

// export class ExampleDataSource extends DataSource<Leaves> {
//   filterChange = new BehaviorSubject('');
//   get filter(): string {
//     return this.filterChange.value;
//   }
//   set filter(filter: string) {
//     this.filterChange.next(filter);
//   }
//   filteredData: Leaves[] = [];
//   renderedData: Leaves[] = [];
//   constructor(
//     public exampleDatabase: MyLeavesService,
//     public paginator: MatPaginator,
//     public _sort: MatSort
//   ) {
//     super();
//     // Reset to the first page when the user changes the filter.
//     this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
//   }
//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<Leaves[]> {
//     // Listen for any changes in the base data, sorting, filtering, or pagination
//     const displayDataChanges = [
//       this.exampleDatabase.dataChange,
//       this._sort.sortChange,
//       this.filterChange,
//       this.paginator.page,
//     ];
//     this.exampleDatabase.getAllMyLeaves();
//     return merge(...displayDataChanges).pipe(
//       map(() => {
//         // Filter data
//         this.filteredData = this.exampleDatabase.data
//           .slice()
//           .filter((Leaves: Leaves) => {
//             const searchStr = (
//               Leaves.type +
//               Leaves.halfDay +
//               Leaves.applyDate +
//               Leaves.reason
//             ).toLowerCase();
//             return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
//           });
//         // Sort filtered data
//         const sortedData = this.sortData(this.filteredData.slice());
//         // Grab the page's slice of the filtered sorted data.
//         const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
//         this.renderedData = sortedData.splice(
//           startIndex,
//           this.paginator.pageSize
//         );
//         return this.renderedData;
//       })
//     );
//   }
//   disconnect() {
//     //disconnect
//   }
//   /** Returns a sorted copy of the database data. */
//   sortData(data: Leaves[]): Leaves[] {
//     if (!this._sort.active || this._sort.direction === '') {
//       return data;
//     }
//     return data.sort((a, b) => {
//       let propertyA: number | string = '';
//       let propertyB: number | string = '';
//       switch (this._sort.active) {
//         case 'id':
//           [propertyA, propertyB] = [a.id, b.id];
//           break;
//         case 'type':
//           [propertyA, propertyB] = [a.type, b.type];
//           break;
//         case 'status':
//           [propertyA, propertyB] = [a.status, b.status];
//           break;
//         case 'applyDate':
//           [propertyA, propertyB] = [a.applyDate, b.applyDate];
//           break;
//         case 'fromDate':
//           [propertyA, propertyB] = [a.fromDate, b.fromDate];
//           break;
//       }
//       const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//       const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
//       return (
//         (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
//       );
//     });
//   }
// }
