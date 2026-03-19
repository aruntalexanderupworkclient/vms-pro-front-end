import { Component, OnInit } from '@angular/core';
import { TokenServiceProxy } from '../../../core/service-proxies';

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

  constructor(private tokenService: TokenServiceProxy) {}

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
}
