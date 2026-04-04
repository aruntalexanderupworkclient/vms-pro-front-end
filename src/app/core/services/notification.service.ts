import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  success(message: string): void {
    this.zone.run(() => {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
  }

  error(message: string): void {
    this.zone.run(() => {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
  }
}
