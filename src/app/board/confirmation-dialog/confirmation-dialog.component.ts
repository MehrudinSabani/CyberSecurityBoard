import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h1 mat-dialog-title>Delete Container</h1>
    <div mat-dialog-content>
      <p>The container will be permanently deleted. Proceed?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onDismiss()">Cancel</button>
      <button mat-button color="warn" (click)="onConfirm()">Confirm</button>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}