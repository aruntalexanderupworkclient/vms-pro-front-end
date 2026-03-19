import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/service-proxies';
import { SsoService } from '../../../core/auth/sso.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private authService: AuthService,
    private ssoService: SsoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential; // Google ID Token (JWT)

    // Send to your backend for validation
    this.http.post<{ token: string }>(`${environment.apiUrl}/auth/google-login`, {
      idToken: idToken
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // store your app's JWT
        // this.ngZone.run(() => {
        //   this.router.navigate(['/dashboard']);
        // });
        this.ngZone.run(() => {
        this.router.navigate(['/dashboard']).then(success => {
          console.log('Navigation success:', success); // check this
        });
      });
      },
      error: (err) => console.error('Login failed', err)
    });
  }


  onLogin(): void {
    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe((user: User | null) => {
      this.loading = false;
      if (user) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Invalid email or password. Try admin@vmspro.com';
      }
    });
  }

  onDemoLogin(): void {
    this.loading = true;
    this.authService.loginAsDemo().subscribe(() => {
      this.loading = false;
      this.router.navigate(['/dashboard']);
    });
  }

  onSsoLogin(): void {
    this.ssoService.login();
  }
}
