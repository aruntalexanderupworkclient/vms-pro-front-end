import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface OrgCard {
  type: string;
  label: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-org-select',
  templateUrl: './org-select.component.html',
  styleUrls: ['./org-select.component.scss']
})
export class OrgSelectComponent {
  orgCards: OrgCard[] = [
    {
      type: 'Hospital',
      label: 'Hospital',
      subtitle: 'Manage visitors and medical appointments',
      icon: 'local_hospital',
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      type: 'Residential Tower',
      label: 'Residential Tower',
      subtitle: 'Track visitors for apartment complexes',
      icon: 'apartment',
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      type: 'Corporate Office',
      label: 'Corporate Office',
      subtitle: 'Enterprise visitor and employee management',
      icon: 'business',
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      type: 'Factory',
      label: 'Factory',
      subtitle: 'Industrial facility process control',
      icon: 'precision_manufacturing',
      color: '#14B8A6',
      bgColor: 'rgba(20, 184, 166, 0.1)'
    }
  ];

  constructor(private router: Router) {}

  selectOrg(card: OrgCard): void {
    sessionStorage.setItem('vms_org_type', card.type);
    this.router.navigate(['/login']);
  }
}
