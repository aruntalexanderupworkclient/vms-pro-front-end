import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MdmServiceProxy } from '../../../core/service-proxies';
import { MdmDto } from '../../../core/models/mdm.model';
import { MdmDialogComponent } from '../mdm-dialog/mdm-dialog.component';

const TYPE_CONFIG: Record<string, { title: string; subtitle: string }> = {
  VisitStatus:       { title: 'Visit Status',       subtitle: 'Manage visit status master data' },
  UserStatus:        { title: 'User Status',         subtitle: 'Manage user status master data' },
  TokenType:         { title: 'Token Type',          subtitle: 'Manage token type master data' },
  OrganisationType:  { title: 'Organisation Type',   subtitle: 'Manage organisation type master data' },
};

@Component({
  selector: 'app-mdm-data',
  templateUrl: './mdm-data.component.html',
  styleUrls: ['./mdm-data.component.scss']
})
export class MdmDataComponent implements OnInit, OnDestroy {
  type = '';
  title = '';
  subtitle = '';
  items: MdmDto[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private mdmService: MdmServiceProxy,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.type = params['type'];
      const config = TYPE_CONFIG[this.type];
      this.title = config?.title ?? this.type;
      this.subtitle = config?.subtitle ?? '';
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.mdmService.getAll(this.type).subscribe({
      next: res => {
        this.items = res.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openAdd(): void {
    const dialogRef = this.dialog.open(MdmDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { type: this.type, title: this.title, editMode: false, item: null }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  openEdit(item: MdmDto): void {
    const dialogRef = this.dialog.open(MdmDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { type: this.type, title: this.title, editMode: true, item: { ...item } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  deleteItem(item: MdmDto): void {
    if (!confirm(`Are you sure you want to delete "${item.value}"?`)) return;

    this.mdmService.delete(this.type, item.id).subscribe({
      next: res => {
        if (res.success) {
          this.snackBar.open('Deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        } else {
          this.snackBar.open(res.message || 'Delete failed', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Failed to delete', 'Close', { duration: 3000 });
      }
    });
  }
}
