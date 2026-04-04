import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeServiceProxy } from '../../core/service-proxies';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  showPanel = false;
  editMode = false;
  currentEmployee: Employee = this.getEmpty();

  constructor(private employeeService: EmployeeServiceProxy) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(res => {
      this.employees = res.data.items;
      this.filteredEmployees = res.data.items;
    });
  }

  applyFilter(): void {
    this.filteredEmployees = this.employees.filter(e =>
      !this.searchTerm ||
      e.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.department?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAdd(): void {
    this.currentEmployee = this.getEmpty();
    this.editMode = false;
    this.showPanel = true;
  }

  openEdit(emp: Employee): void {
    this.currentEmployee = { ...emp };
    this.editMode = true;
    this.showPanel = true;
  }

  closePanel(): void { this.showPanel = false; }

  save(): void {
    if (this.editMode) {
      this.employeeService.updateEmployee(this.currentEmployee.id, this.currentEmployee).subscribe(() => {
        this.loadEmployees();
        this.closePanel();
      });
    } else {
      const newId = Math.max(...this.employees.map(e => e.id), 0) + 1;
      this.currentEmployee.id = newId;
      this.employeeService.createEmployee(this.currentEmployee).subscribe(() => {
        this.loadEmployees();
        this.closePanel();
      });
    }
  }

  deleteEmployee(emp: Employee): void {
    if (confirm(`Delete employee "${emp.name}"?`)) {
      this.employeeService.deleteEmployee(emp.id).subscribe(() => this.loadEmployees());
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  private getEmpty(): Employee {
    return { id: 0, name: '', employeeId: '', status: true };
  }
}
