import { Component } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  template: `
    <div class="access-denied">
      <div class="denied-content">
        <span class="material-icons denied-icon">block</span>
        <h1>403 — Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <a routerLink="/dashboard" class="btn btn-primary">
          <span class="material-icons">arrow_back</span>
          Back to Dashboard
        </a>
      </div>
    </div>
  `,
  styles: [`
    .access-denied {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .denied-icon {
      font-size: 80px;
      color: #EF4444;
      margin-bottom: 24px;
    }
    .denied-content h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #111827;
    }
    .denied-content p {
      font-size: 16px;
      color: #6B7280;
      margin-bottom: 32px;
    }
  `]
})
export class AccessDeniedComponent {}
