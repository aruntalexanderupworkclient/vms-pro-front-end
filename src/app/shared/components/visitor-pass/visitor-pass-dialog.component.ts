import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface VisitorPassDialogData {
  tokenId: string;
  visitorId: string;
}

@Component({
  selector: 'app-visitor-pass-dialog',
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Visitor Pass</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-dialog-content>
      <app-visitor-pass
        [tokenId]="data.tokenId"
        [visitorId]="data.visitorId">
      </app-visitor-pass>
    </mat-dialog-content>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 8px 0 24px;
    }
    h2 { margin: 0; }
    ::ng-deep .mat-dialog-content { padding: 0; overflow: visible; }
  `]
})
export class VisitorPassDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VisitorPassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VisitorPassDialogData
  ) {}
}
