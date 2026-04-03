import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MdmServiceProxy } from '../../../core/service-proxies';
import { MdmDto } from '../../../core/models/mdm.model';

export interface MdmDialogData {
  type: string;
  title: string;
  editMode: boolean;
  item: MdmDto | null;
}

@Component({
  selector: 'app-mdm-dialog',
  templateUrl: './mdm-dialog.component.html',
  styleUrls: ['./mdm-dialog.component.scss']
})
export class MdmDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private mdmService: MdmServiceProxy,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MdmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MdmDialogData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      code: [this.data.item?.code ?? '', Validators.required],
      value: [this.data.item?.value ?? '', Validators.required],
      isActive: [this.data.item?.isActive ?? true]
    });
  }

  get dialogTitle(): string {
    return this.data.editMode ? `Edit ${this.data.title}` : `Add New ${this.data.title}`;
  }

  get submitLabel(): string {
    return this.data.editMode ? 'Update' : 'Create';
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;

    const payload = {
      code: this.form.value.code,
      value: this.form.value.value,
      sortOrder: this.data.item?.sortOrder ?? 0,
      isActive: this.form.value.isActive
    };

    const request$ = this.data.editMode
      ? this.mdmService.update(this.data.type, this.data.item!.id, payload)
      : this.mdmService.create(this.data.type, payload);

    request$.subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open(
            this.data.editMode ? 'Updated successfully' : 'Created successfully',
            'Close',
            { duration: 3000 }
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
