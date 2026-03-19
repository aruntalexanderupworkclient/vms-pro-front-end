import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';
import { VisitorServiceProxy } from '../../core/service-proxies';
import { TokenServiceProxy } from '../../core/service-proxies';
import { EmployeeServiceProxy } from '../../core/service-proxies';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Stat cards
  stats = [
    { label: 'Active Visitors', value: 0, icon: 'people', color: '#2563EB', bgColor: 'rgba(37,99,235,0.1)', trend: '+12%' },
    { label: "Today's Tokens", value: 0, icon: 'local_offer', color: '#10B981', bgColor: 'rgba(16,185,129,0.1)', trend: '+8%' },
    { label: 'Pending Approvals', value: 0, icon: 'pending_actions', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.1)', trend: '-3%' },
    { label: 'Employees On Duty', value: 0, icon: 'work', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.1)', trend: '+5%' }
  ];

  // Recent visitors
  recentVisitors: any[] = [];

  // Visitors Per Day chart
  barChartLabels: Label[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  barChartData: ChartDataSets[] = [
    { data: [28, 35, 42, 38, 45, 20, 15], label: 'Visitors', backgroundColor: 'rgba(37,99,235,0.8)', borderColor: '#2563EB', borderWidth: 1 }
  ];
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }]
    },
    legend: { display: false }
  };
  barChartType: ChartType = 'bar';

  // Token Distribution chart
  doughnutChartLabels: Label[] = ['General', 'Guest', 'Delivery', 'Maintenance', 'Doctor Visit'];
  doughnutChartData: SingleDataSet = [35, 25, 20, 12, 8];
  doughnutChartColors: Color[] = [{
    backgroundColor: ['#2563EB', '#8B5CF6', '#F59E0B', '#14B8A6', '#10B981']
  }];
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' }
  };

  constructor(
    private visitorService: VisitorServiceProxy,
    private tokenService: TokenServiceProxy,
    private employeeService: EmployeeServiceProxy
  ) {}

  ngOnInit(): void {
    this.visitorService.getAllVisitors().subscribe(res => {
      const visitors = res.data.items;
      this.recentVisitors = visitors.slice(0, 5);
      this.stats[0].value = visitors.filter((v: any) => v.status === 'checked-in').length;
      this.stats[2].value = visitors.filter((v: any) => v.status === 'pending').length;
    });

    this.tokenService.getAllTokens().subscribe(res => {
      this.stats[1].value = res.data.items.filter((t: any) => t.status === 'active').length;
    });

    this.employeeService.getAllEmployees().subscribe(res => {
      this.stats[3].value = res.data.items.filter((e: any) => e.status === 'active').length;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'checked-in': return 'badge badge-green';
      case 'checked-out': return 'badge badge-blue';
      case 'pending': return 'badge badge-amber';
      default: return 'badge';
    }
  }
}
