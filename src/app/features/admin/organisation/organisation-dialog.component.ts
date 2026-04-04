import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganizationServiceProxy } from '../../../core/service-proxies';
import { MdmServiceProxy } from '../../../core/service-proxies/mdm-service-proxy';
import { OrganisationDto } from '../../../core/models/organization.model';
import { MdmDto } from '../../../core/models/mdm.model';

export interface OrganisationDialogData {
  editMode: boolean;
  item: OrganisationDto | null;
}

@Component({
  selector: 'app-organisation-dialog',
  templateUrl: './organisation-dialog.component.html',
  styleUrls: ['./organisation-dialog.component.scss']
})
export class OrganisationDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  orgTypes: MdmDto[] = [];
  loadingTypes = false;

  constructor(
    private fb: FormBuilder,
    private orgService: OrganizationServiceProxy,
    private mdmService: MdmServiceProxy,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<OrganisationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganisationDialogData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      type: [this.data.item?.type ?? '', Validators.required],
      name: [this.data.item?.name ?? '', Validators.required],
      address: [this.data.item?.address ?? '', Validators.required]
    });

    this.loadOrgTypes();
  }

  get dialogTitle(): string {
    return this.data.editMode ? 'Edit Organisation' : 'Add New Organisation';
  }

  get submitLabel(): string {
    return this.data.editMode ? 'Update' : 'Create';
  }

  private loadOrgTypes(): void {
    this.loadingTypes = true;
    this.mdmService.getAll('OrganisationType').subscribe({
      next: res => {
        this.orgTypes = (res.data ?? []).filter(t => t.isActive);
        this.loadingTypes = false;
      },
      error: () => {
        this.snackBar.open('Failed to load organisation types', 'Close', { duration: 3000 });
        this.loadingTypes = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;

    const payload = {
      type: this.form.value.type,
      name: this.form.value.name,
      address: this.form.value.address
    };

    const request$ = this.data.editMode
      ? this.orgService.update(this.data.item!.id, payload)
      : this.orgService.create(payload);

    request$.subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open(
            this.data.editMode ? 'Organisation updated successfully' : 'Organisation created successfully',
            'Close', { duration: 3000 }
          );
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(res.message || 'Operation failed', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Something went wrong', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
