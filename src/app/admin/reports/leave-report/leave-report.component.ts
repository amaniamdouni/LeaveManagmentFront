import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeaveReportService } from './leave-report.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AllClaims } from './leave-report.model';
import { DialogformComponent } from 'app/ui/modal/dialogform/dialogform.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-report',
  templateUrl: './leave-report.component.html',
  styleUrls: ['./leave-report.component.scss'],
})
export class LeaveReportComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  filterToggle = false;
  displayedColumns = [
    'claimStatus',
    'claimPriority',
    'date',
    'details',
    'actions',
  ];

  exampleDatabase?: LeaveReportService;
  dataSource!: ExampleDataSource;
  dataSourceClaim: any;
  id?: number;
  leaves?: AllClaims;
  private dialogModel: MatDialog;
  constructor(
    public httpClient: HttpClient,
    public leavesService: LeaveReportService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  ngOnInit() {
    this.loadData();
  }
  public loadData() {
    this.leavesService.getAllLeavess().subscribe(x => {
      this.dataSourceClaim = x ;
      console.log(this.dataSourceClaim);
    });
  }
  toggleStar(row: AllClaims) {
    console.log(row);
  }
  openDialog(): void {
    this.dialogModel.open(DialogformComponent, {
      width: '640px',
      disableClose: true,
    });
  }
  }
export class ExampleDataSource extends DataSource<AllClaims> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: AllClaims[] = [];
  renderedData: AllClaims[] = [];
  constructor(
    public exampleDatabase: LeaveReportService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<AllClaims[]> {
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
          .filter((myTasks: AllClaims) => {
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
    // disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: AllClaims[]): AllClaims[] {
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
