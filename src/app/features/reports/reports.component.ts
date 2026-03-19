import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { VisitorServiceProxy } from '../../core/service-proxies';
import { TokenServiceProxy } from '../../core/service-proxies';
import { EmployeeServiceProxy } from '../../core/service-proxies';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  activeTab = 'visitors';
  dateFrom = '';
  dateTo = '';

  visitors: any[] = [];
  tokens: any[] = [];
  employees: any[] = [];

  // Visitor chart
  visitorChartLabels: Label[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  visitorChartData: ChartDataSets[] = [
    { data: [28, 35, 42, 38, 45, 20, 15], label: 'Visitors', backgroundColor: 'rgba(37,99,235,0.7)' }
  ];
  visitorChartType: ChartType = 'bar';
  visitorChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, legend: { display: false } };

  // Token chart
  tokenChartLabels: Label[] = ['General', 'Guest', 'Delivery', 'Maintenance', 'Doctor Visit'];
  tokenChartData: ChartDataSets[] = [
    { data: [35, 25, 20, 12, 8], label: 'Tokens', backgroundColor: ['#2563EB', '#8B5CF6', '#F59E0B', '#14B8A6', '#10B981'] }
  ];
  tokenChartType: ChartType = 'bar';
  tokenChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, legend: { display: false } };

  constructor(
    private visitorService: VisitorServiceProxy,
    private tokenService: TokenServiceProxy,
    private employeeService: EmployeeServiceProxy
  ) {}

  ngOnInit(): void {
    this.visitorService.getAllVisitors().subscribe(res => this.visitors = res.data.items);
    this.tokenService.getAllTokens().subscribe(res => this.tokens = res.data.items);
    this.employeeService.getAllEmployees().subscribe(res => this.employees = res.data.items);
  }

  exportPdf(): void {
    alert('PDF export — integrate jsPDF or backend endpoint');
  }

  exportExcel(): void {
    alert('Excel export — integrate SheetJS or backend endpoint');
  }
}
