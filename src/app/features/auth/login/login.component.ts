import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/service-proxies';
import { SsoService } from '../../../core/auth/sso.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private ngZone: NgZone,
    private authService: AuthService,
    private ssoService: SsoService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.initGoogleSignIn();
  }

  private initGoogleSignIn(): void {
    // Load Google SDK script dynamically (only on login page)
    if (typeof google !== 'undefined' && google.accounts) {
      this.renderGoogleButton();
    } else if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.renderGoogleButton();
      script.onerror = () => console.warn('Google Sign-In SDK failed to load');
      document.head.appendChild(script);
    } else {
      // Script tag exists but SDK not ready yet — poll
      let retries = 0;
      const interval = setInterval(() => {
        retries++;
        if (typeof google !== 'undefined' && google.accounts) {
          clearInterval(interval);
          this.renderGoogleButton();
        } else if (retries >= 20) {
          clearInterval(interval);
          console.warn('Google Sign-In SDK failed to load');
        }
      }, 250);
    }
  }

  private renderGoogleButton(): void {
    try {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.ngZone.run(() => this.handleGoogleCredentialResponse(response))
      });

      const btnEl = document.getElementById('google-btn');
      if (btnEl) {
        google.accounts.id.renderButton(btnEl, { theme: 'outline', size: 'large' });
      }
    } catch (e) {
      console.warn('Google Sign-In initialization failed:', e);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleGoogleCredentialResponse(response: any): void {

    this.authService.loginWithGoogleCredentials(response).pipe(
      finalize(() => this.loading = false),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.notificationService.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        console.clear();
        console.error(err);
        if (err.status === 401) {
          this.notificationService.error('Unauthorized');
        } else {
          this.notificationService.error('Something went wrong');
        }
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    const credentials_1: { email: string; password: string } = {
      email: credentials.username,
      password: credentials.password
    };

    this.authService.loginWithCredentials(credentials_1).pipe(
      finalize(() => this.loading = false),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.notificationService.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.notificationService.error('Unauthorized');
        } else {
          this.notificationService.error('Something went wrong');
        }
      }
    });
  }

  onDemoLogin(): void {
    this.loading = true;
    this.authService.loginAsDemo().pipe(
      finalize(() => this.loading = false),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.notificationService.success('Login successful');
      this.router.navigate(['/dashboard']);
    });
  }

  onSsoLogin(): void {
    this.ssoService.login();
  }
}
