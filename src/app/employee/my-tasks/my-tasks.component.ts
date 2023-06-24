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
import { DeleteComponent } from './dialogs/delete/delete.component';
import { SelectionModel } from '@angular/cdk/collections';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MyTasksService } from './my-tasks.service';
import { Claim, ClaimPriority } from './my-tasks.model';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate } from '@angular/common';
import { C } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
})
export class MyTasksComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    'select',
    'claimStatus',
    'claimPriority',
    'date',
    'details',
    'actions',
  ];

  exampleDatabase?: MyTasksService | null;
  dataSource!: ExampleDataSource;
  dataSourceClaim: any;
  selection = new SelectionModel<Claim>(true, []);
  index?: number;
  id?: number;
  myTasks?: Claim | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public claimService: MyTasksService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  
  
  ngOnInit() {
    this.loadData();
  
  }
  refresh() {
    
    this.loadData();
  }
 addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        myTasks: this.myTasks,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const newClaim: Claim = this.claimService.getDialogData();
        // Utilisez la méthode addClaim pour ajouter la nouvelle revendication
        this.claimService.addClaim(newClaim).subscribe((addedClaim) => {
          console.log(newClaim.description)
          // Le code ci-dessous sera exécuté une fois que la revendication sera ajoutée avec succès
          this.exampleDatabase?.dataChange.value.unshift(addedClaim);
        this.refreshTable();
        },);
      }
    });
  }

 /* editCall(row: Claim) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        myTasks: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.exampleDatabase) {
          const updatedClaim: Claim = this.claimService.getDialogData();
        // Utilisez la méthode updateMyTasks pour mettre à jour la tâche
        this.claimService.updateMyTasks(updatedClaim).subscribe((updatedClaim) => {
          this.claimService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            'black',
            'Edit Record Successfully...!!!',
            'bottom',
            'center'
            );
          },);
        }
      }
    });
  }*/

  editCall(row: Claim) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        myTasks: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        console.log('foundIndex:', foundIndex);
        if (foundIndex != null && this.exampleDatabase) {
          const updatedClaim: Claim = this.claimService.getDialogData();
          console.log('updatedClaim:', updatedClaim);
          this.claimService.updateMyTasks(updatedClaim).subscribe(() => {
            this.claimService.getDialogData();
            this.refreshTable();
          });
        } else {
          console.log('Error: No matching index found.');
        }
      }
    });
  }
  

 /* deleteItem(i: number, row: Claim) {
    this.index = i;
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(DeleteComponent, {
      height: '270px',
      width: '300px',
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex !== undefined && this.exampleDatabase !== undefined) {
          this.exampleDatabase?.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.showNotification(
            'snackbar-danger',
            'Delete Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }*/
  
  deleteMyTasks(id: number): void {
    this.httpClient.delete<Claim>("/deleteClaim/" + id).subscribe(() => {
      // Handle the success response or perform any additional actions
      console.log("Record deleted successfully");
    }, (error) => {
      // Handle the error response or display an error message
      console.error("Error deleting record:", error);
    });
  }
  deleteItem(i: number, row: Claim) {
    this.index = i;
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
  
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: '270px',
      width: '300px',
      data: row,
      direction: tempDirection,
    });
  
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        if (this.id !== undefined && this.exampleDatabase !== undefined) {
          this.claimService.deleteMyTasks(this.id, row.claimStatus).subscribe(
            () => {
              this.exampleDatabase.dataChange.value.splice(this.index, 1);
              this.refreshTable();
              console.log("Record deleted successfully");
            },
            (error) => {
              console.error("Error deleting record:", error);
            }
          );
        }
      } else {
        console.log("err");
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase?.dataChange.value.splice(index, 1);

      this.refreshTable();
      this.selection = new SelectionModel<Claim>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
  // dataSource => dataSourceClaim
  public loadData() {
    this.claimService.getclaims().subscribe(x => {
      this.dataSourceClaim = x ;
      console.log(this.dataSourceClaim);
    });
  }
  // export table data in excel file
  exportExcel() {
    if (this.dataSourceClaim.filteredData) {
      const exportData: Partial<TableElement>[] = this.dataSourceClaim.filteredData.map((x) => ({
        Status: x.claimStatus,
        Priority: x.claimPriority,
        'Joining Date': x.dateClaim,
        Details: x.description,
      }));
  
      TableExportUtil.exportToExcel(exportData, 'excel');
    }
  }
  
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
}
export class ExampleDataSource extends DataSource<Claim> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Claim[] = [];
  renderedData: Claim[] = [];
  constructor(
    public exampleDatabase: MyTasksService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Claim[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    //this.exampleDatabase.getAllClaims();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((myTasks: Claim) => {
            const searchStr = (
              myTasks.claimStatus,
              myTasks.claimPriority,
              myTasks.dateClaim +
              myTasks.description
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {
    //disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: Claim[]): Claim[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'status':
          [propertyA, propertyB] = [a.claimStatus, b.claimStatus];
          break;
        case 'priority':
          [propertyA, propertyB] = [a.claimPriority, b.claimPriority];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
