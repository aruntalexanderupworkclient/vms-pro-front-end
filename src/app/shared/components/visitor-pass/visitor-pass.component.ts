import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Token } from '../../../core/models';
import { TokenServiceProxy } from '../../../core/service-proxies';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-visitor-pass',
  templateUrl: './visitor-pass.component.html',
  styleUrls: ['./visitor-pass.component.scss']
})
export class VisitorPassComponent implements OnInit, OnDestroy {
  @Input() visitorId!: string;
  @Input() tokenId!: string;

  token: Token | null = null;
  qrData = '';
  loading = true;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(private tokenService: TokenServiceProxy) {}

  ngOnInit(): void {
    if (!this.tokenId) {
      this.error = 'Token ID is required';
      this.loading = false;
      return;
    }

    this.tokenService
      .getTokenById(this.tokenId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.token = res.data;
            // this.qrData = `/visit/scan?token=${this.token.tokenNo}`;
            this.qrData = `${environment.apiUrl}/Tokens/Scan?id=${this.token.id}`;
          } else {
            this.error = res.message || 'Failed to load token details';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load token details';
          this.loading = false;
        }
      });
  }

  print(): void {
    window.print();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
