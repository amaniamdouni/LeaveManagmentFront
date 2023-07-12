import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MyLeavesService } from '../../my-leaves.service';
import { Leaves } from '../../models/leaves.model';

export interface DialogData {
  Leaves: Leaves,
  action: string
}

@Component({
  selector: 'app-delete:not(q)',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public myLeavesService: MyLeavesService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    console.log(this.data.Leaves.id);
    this.myLeavesService.deleteLeave(this.data.Leaves.id).subscribe((res) => {
      console.log(res);
    },
     (err) => {
      console.log(err);
    });
  }
}
