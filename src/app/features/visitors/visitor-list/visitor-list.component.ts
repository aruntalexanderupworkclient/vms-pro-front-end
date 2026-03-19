import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitorServiceProxy, Visitor } from '../../../core/service-proxies';

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.scss']
})
export class VisitorListComponent implements OnInit {
  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  searchTerm = '';
  statusFilter = '';

  constructor(private visitorService: VisitorServiceProxy, private router: Router) { }

  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors(): void {
    this.visitorService.getAllVisitors().subscribe(res => {
      this.visitors = res.data.items;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredVisitors = this.visitors.filter(v => {
      const matchesSearch = !this.searchTerm ||
        v.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        v.hostName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || v.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  registerVisitor(): void {
    this.router.navigate(['/visitors/register']);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'checked-in': return 'badge badge-green';
      case 'checked-out': return 'badge badge-blue';
      case 'pending': return 'badge badge-amber';
      default: return 'badge';
    }
  }

  checkOut(visitor: any): void {
    visitor.status = 'checked-out';
    visitor.checkOut = new Date().toISOString();
    this.visitorService.updateVisitor(visitor.id, visitor).subscribe(() => {
      this.loadVisitors();
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }
}
