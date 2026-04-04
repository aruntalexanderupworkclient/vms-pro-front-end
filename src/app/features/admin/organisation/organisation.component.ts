import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrganizationServiceProxy } from '../../../core/service-proxies';
import { OrganisationDto } from '../../../core/models/organization.model';
import { OrganisationDialogComponent } from './organisation-dialog.component';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit, OnDestroy {
  items: OrganisationDto[] = [];
  loading = false;

  // Pagination
  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  hasPreviousPage = false;
  hasNextPage = false;

  // Search
  search = '';
  private searchSubject$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private orgService: OrganizationServiceProxy,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.searchSubject$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.search = term;
      this.page = 1;
      this.loadData();
    });

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(term: string): void {
    this.searchSubject$.next(term);
  }

  loadData(): void {
    this.loading = true;
    this.orgService.getAll(this.page, this.pageSize, this.search).subscribe({
      next: res => {
        const paged = res.data;
        this.items = paged?.items ?? [];
        this.totalCount = paged?.totalCount ?? 0;
        this.totalPages = paged?.totalPages ?? 0;
        this.hasPreviousPage = paged?.hasPreviousPage ?? false;
        this.hasNextPage = paged?.hasNextPage ?? false;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load organisations', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadData();
  }

  openAdd(): void {
    const dialogRef = this.dialog.open(OrganisationDialogComponent, {
      width: '550px',
      disableClose: true,
      data: { editMode: false, item: null }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  openEdit(item: OrganisationDto): void {
    const dialogRef = this.dialog.open(OrganisationDialogComponent, {
      width: '550px',
      disableClose: true,
      data: { editMode: true, item: { ...item } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  deleteItem(item: OrganisationDto): void {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    this.orgService.delete(item.id).subscribe({
      next: res => {
        if (res.success) {
          this.snackBar.open('Organisation deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        } else {
          this.snackBar.open(res.message || 'Delete failed', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Failed to delete organisation', 'Close', { duration: 3000 });
      }
    });
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
