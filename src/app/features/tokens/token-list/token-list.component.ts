import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokenServiceProxy } from '../../../core/service-proxies';
import { VisitorPassDialogComponent } from '../../../shared/components/visitor-pass/visitor-pass-dialog.component';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss']
})
export class TokenListComponent implements OnInit {
  tokens: any[] = [];
  filteredTokens: any[] = [];
  searchTerm = '';
  typeFilter = '';
  tokenTypes = ['General', 'Guest', 'Delivery', 'Maintenance', 'Doctor Visit'];

  constructor(
    private tokenService: TokenServiceProxy,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTokens();
  }

  loadTokens(): void {
    this.tokenService.getAllTokens().subscribe(res => {
      this.tokens = res.data.items;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredTokens = this.tokens.filter(t => {
      const matchesSearch = !this.searchTerm ||
        t.visitorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.tokenNo.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.typeFilter || t.type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'General': return 'badge badge-blue';
      case 'Guest': return 'badge badge-purple';
      case 'Delivery': return 'badge badge-amber';
      case 'Maintenance': return 'badge badge-teal';
      case 'Doctor Visit': return 'badge badge-green';
      default: return 'badge';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'badge badge-green';
      case 'expired': return 'badge badge-red';
      case 'revoked': return 'badge badge-amber';
      default: return 'badge';
    }
  }

  generateTokenQR(token: any): void {
    console.log('Generating QR for token:', token);
    this.dialog.open(VisitorPassDialogComponent, {
      width: '440px',
      data: {
        tokenId: token.id,
        visitorId: token.visitorId
      }
    });
  }
}
