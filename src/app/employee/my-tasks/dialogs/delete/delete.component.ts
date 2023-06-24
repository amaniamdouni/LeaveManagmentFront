import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MyTasksService } from '../../my-tasks.service';
import { ClaimStatus } from '../../my-tasks.model';

export interface DialogData {
  id: number;
  claimStatus: string;
  description: string;
}

@Component({
  selector: 'app-delete:not(r)',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public myTasksService: MyTasksService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    const claimStatusString = ClaimStatus[this.data.claimStatus];
    this.myTasksService.deleteMyTasks(this.data.id, claimStatusString).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  
}
