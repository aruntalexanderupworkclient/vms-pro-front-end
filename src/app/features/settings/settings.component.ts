import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  activeTab = 'general';

  generalSettings = {
    companyName: 'VMS Pro Corporation',
    timezone: 'UTC+5:30',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    autoCheckoutHours: 8
  };

  brandingSettings = {
    primaryColor: '#2563EB',
    logoUrl: '',
    welcomeMessage: 'Welcome to VMS Pro'
  };

  locations = [
    { id: 1, name: 'Main Entrance', type: 'Gate', status: 'active' },
    { id: 2, name: 'Side Entrance', type: 'Gate', status: 'active' },
    { id: 3, name: 'Loading Dock', type: 'Delivery', status: 'active' }
  ];

  notificationTemplates = [
    { id: 1, name: 'Visitor Check-In', channel: 'Email + SMS', enabled: true },
    { id: 2, name: 'Visitor Check-Out', channel: 'Email', enabled: true },
    { id: 3, name: 'Appointment Reminder', channel: 'SMS', enabled: false },
    { id: 4, name: 'Token Expiry Warning', channel: 'Push', enabled: true }
  ];

  industryConfig = {
    orgType: sessionStorage.getItem('vms_org_type') || 'Corporate Office',
    requirePhoto: true,
    requireIdScan: false,
    maxVisitDuration: 8,
    enableTokens: true,
    enableAppointments: true
  };

  save(): void {
    alert('Settings saved successfully!');
  }
}
