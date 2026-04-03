import { Component, OnInit } from '@angular/core';
import { AppointmentServiceProxy } from '../../core/service-proxies';
import { HostServiceProxy } from '../../core/service-proxies';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  hosts: any[] = [];

  newAppointment: any = {
    visitorName: '',
    hostId: null,
    hostName: '',
    date: '',
    time: '',
    purpose: '',
    notes: '',
    status: 'pending'
  };

  constructor(
    private appointmentService: AppointmentServiceProxy,
    private hostService: HostServiceProxy
  ) {}

  ngOnInit(): void {
    this.appointmentService.getAllAppointments().subscribe(res => {
      this.appointments = res.data.items;
    });
    this.hostService.getAllHosts().subscribe(res => {
      this.hosts = res.data.items.filter(h => h.status);
      console.log('Loaded hosts:', this.hosts);
    });
  }

  onHostChange(): void {
    const host = this.hosts.find(h => h.id === +this.newAppointment.hostId);
    this.newAppointment.hostName = host ? host.name : '';
  }

  saveAppointment(): void {
    const newId = Math.max(...this.appointments.map(a => a.id), 0) + 1;
    this.newAppointment.id = newId;
    this.appointmentService.createAppointment(this.newAppointment).subscribe(() => {
      this.appointments.push({ ...this.newAppointment });
      this.newAppointment = {
        visitorName: '', hostId: null, hostName: '', date: '', time: '', purpose: '', notes: '', status: 'pending'
      };
    });
  }

  getStatusBadgeClass(status: string): string {
    return status === 'confirmed' ? 'badge badge-green' : 'badge badge-amber';
  }

  getCalendarDates(): any[] {
    // Simple calendar view for demo
    const dates: any[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      dates.push({
        date: d,
        dateStr,
        appointments: this.appointments.filter(a => a.date === dateStr)
      });
    }
    return dates;
  }
}
