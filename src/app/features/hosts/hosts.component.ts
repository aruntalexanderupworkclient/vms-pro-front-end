import { Component, OnInit } from '@angular/core';
import { MdmDto, MdmType, MdmServiceProxy, HostServiceProxy } from '../../core/service-proxies';
import { Host } from '../../core/models';

@Component({
  selector: 'app-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss']
})
export class HostsComponent implements OnInit {
  hosts: Host[] = [];
  filteredHosts: Host[] = [];
  searchTerm = '';
  showPanel = false;
  editMode = false;
  currentHost: Host = this.getEmpty();

  organisationTypes: MdmDto[] = [];

  constructor(private hostService: HostServiceProxy, private mdmService: MdmServiceProxy) {}

  ngOnInit(): void {
    this.loadOrganisationTypes();
    this.loadHosts();
  }

  loadHosts(): void {
    this.hostService.getAllHosts().subscribe(res => {
      this.hosts = res.data.items as Host[];
      this.filteredHosts = res.data.items as Host[];
    });
  }

  loadOrganisationTypes(): void {
    this.mdmService.getAll(MdmType.OrganisationType).subscribe(res => {
      this.organisationTypes = res.data;
    });
  }

  applyFilter(): void {
    this.filteredHosts = this.hosts.filter(h =>
      !this.searchTerm || h.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAdd(): void { this.currentHost = this.getEmpty(); this.editMode = false; this.showPanel = true; }
  openEdit(host: Host): void { this.currentHost = { ...host }; this.editMode = true; this.showPanel = true; }
  closePanel(): void { this.showPanel = false; }

  save(): void {
    const { name, unit, contact, orgType, status } = this.currentHost;
    const dto = { name, unit, contact, orgType, status };
    if (this.editMode) {
      this.hostService.updateHost(this.currentHost.id, dto).subscribe(() => { this.loadHosts(); this.closePanel(); });
    } else {
      this.hostService.createHost(dto).subscribe(() => { this.loadHosts(); this.closePanel(); });
    }
  }

  deleteHost(host: Host): void {
    if (confirm(`Delete host "${host.name}"?`)) {
      this.hostService.deleteHost(host.id).subscribe(() => this.loadHosts());
    }
  }

  private getEmpty(): Host {
    return { id: 0, name: '', unit: '', contact: '', orgType: 'Corporate Office', status: true };
  }
}
