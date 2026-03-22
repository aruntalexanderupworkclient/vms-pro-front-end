import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitorServiceProxy } from '../../../core/service-proxies';
import { HostServiceProxy } from '../../../core/service-proxies';

@Component({
  selector: 'app-visitor-registration',
  templateUrl: './visitor-registration.component.html',
  styleUrls: ['./visitor-registration.component.scss']
})
export class VisitorRegistrationComponent implements OnInit {
  hosts: any[] = [];
  hostSearch = '';
  filteredHosts: any[] = [];
  showHostDropdown = false;
  photoCaptured = false;

  visitor: any = {
    name: '',
    idType: 'Passport',
    idNumber: '',
    phone: '',
    purpose: '',
    hostId: null,
    hostName: '',
    expectedDuration: '',
    photo: null,
    status: 'checked-in',
    checkIn: '',
    checkOut: null,
    tokenId: null,
    orgType: ''
  };

  idTypes = ['Passport', 'Driver License', 'National ID', 'Employee Badge', 'Other'];

  constructor(
    private visitorService: VisitorServiceProxy,
    private hostService: HostServiceProxy,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hostService.getAllHosts().subscribe(res => {
      this.hosts = res.data.items.filter(h => h.status.toLowerCase() === 'active');
      this.filteredHosts = this.hosts;
    });
    this.visitor.orgType = sessionStorage.getItem('vms_org_type') || 'Corporate Office';
  }

  filterHosts(): void {
    this.filteredHosts = this.hosts.filter(h =>
      h.name.toLowerCase().includes(this.hostSearch.toLowerCase())
    );
    this.showHostDropdown = true;
  }

  selectHost(host: any): void {
    this.visitor.hostId = host.id;
    this.visitor.hostName = host.name;
    this.hostSearch = host.name;
    this.showHostDropdown = false;
  }

  capturePhoto(): void {
    // Placeholder for webcam integration
    this.photoCaptured = true;
    this.visitor.photo = 'photo_captured_placeholder';
  }

  checkIn(): void {
    this.visitor.checkIn = new Date().toISOString();
    this.visitorService.getAllVisitors().subscribe(res => {
      const newId = Math.max(...res.data.items.map(v => v.id), 0) + 1;
      //this.visitor.id = newId;
      this.visitorService.createVisitor(this.visitor).subscribe((result) => {
        this.router.navigate(['/tokens/generate'], {
          queryParams: { visitorId: result.data.id }
        });
      });
    });
  }
}
