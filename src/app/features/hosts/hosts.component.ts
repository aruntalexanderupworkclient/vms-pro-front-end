import { Component, OnInit } from '@angular/core';
import { HostServiceProxy } from '../../core/service-proxies';

@Component({
  selector: 'app-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss']
})
export class HostsComponent implements OnInit {
  hosts: any[] = [];
  filteredHosts: any[] = [];
  searchTerm = '';
  showPanel = false;
  editMode = false;
  currentHost: any = this.getEmpty();

  constructor(private hostService: HostServiceProxy) {}

  ngOnInit(): void {
    this.loadHosts();
  }

  loadHosts(): void {
    this.hostService.getAllHosts().subscribe(res => {
      this.hosts = res.data.items;
      this.filteredHosts = res.data.items;
    });
  }

  applyFilter(): void {
    this.filteredHosts = this.hosts.filter(h =>
      !this.searchTerm || h.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAdd(): void { this.currentHost = this.getEmpty(); this.editMode = false; this.showPanel = true; }
  openEdit(host: any): void { this.currentHost = { ...host }; this.editMode = true; this.showPanel = true; }
  closePanel(): void { this.showPanel = false; }

  save(): void {
    if (this.editMode) {
      this.hostService.updateHost(this.currentHost.id, this.currentHost).subscribe(() => { this.loadHosts(); this.closePanel(); });
    } else {
      const newId = Math.max(...this.hosts.map(h => h.id), 0) + 1;
      this.currentHost.id = newId;
      this.hostService.createHost(this.currentHost).subscribe(() => { this.loadHosts(); this.closePanel(); });
    }
  }

  deleteHost(host: any): void {
    if (confirm(`Delete host "${host.name}"?`)) {
      this.hostService.deleteHost(host.id).subscribe(() => this.loadHosts());
    }
  }

  private getEmpty(): any {
    return { id: 0, name: '', unit: '', contact: '', orgType: 'Corporate Office', status: 'active' };
  }
}
