import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserServiceProxy, User, UpdateUserDto } from '../../core/service-proxies';
import { AuthService } from '../../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  user: User | null = null;
  originalUser: User | null = null;
  isLoading = false;
  isSaving = false;

  constructor(
    private userService: UserServiceProxy,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.loadUserProfile();
    }
  }

  loadUserProfile(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.id) {
      this.isLoading = true;
      this.userService.getUserById(currentUser.id).subscribe(
        res => {
          this.user = res.data;
          this.originalUser = { ...res.data };
          this.isLoading = false;
        },
        error => {
          console.error('Error loading user profile:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
        }
      );
    }
  }

  saveProfile(): void {
    if (!this.user || !this.user.id) return;

    this.isSaving = true;
    const updateDto = this.mapToUpdateUserDto(this.user);

    this.userService.updateUser(this.user.id, updateDto).subscribe(
      res => {
        // Update AuthService with new user data
        this.authService.setAuthSession(localStorage.getItem('token') || '', res.data);
        
        this.isSaving = false;
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        this.closePanel();
      },
      error => {
        console.error('Error updating profile:', error);
        this.isSaving = false;
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
      }
    );
  }

  closePanel(): void {
    this.close.emit();
  }

  cancel(): void {
    this.user = { ...this.originalUser! };
    this.closePanel();
  }

  private mapToUpdateUserDto(user: User): UpdateUserDto {
    return {
      FullName: user.fullName,
      Email: user.email,
      Phone: user.phone,
      RoleId: user.roleId,
      StatusId: user.statusId,
      OrganisationId: user.organisationId || null
    };
  }
}
