import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
      { id: '00000000-0000-0000-0000-000000000001', fullName: 'Admin User', email: 'admin@vmspro.com', phone: '+1234567890', roleId: '00000000-0000-0000-0000-000000000001', roleName: 'Super Admin', status: 0, organisationId: '00000000-0000-0000-0000-000000000001', organisationName: 'VMS Pro', createdAt: '2026-01-01T00:00:00', updatedAt: null },
      { id: '00000000-0000-0000-0000-000000000002', fullName: 'John Smith', email: 'john@vmspro.com', phone: '+1234567891', roleId: '00000000-0000-0000-0000-000000000002', roleName: 'Manager', status: 0, organisationId: '00000000-0000-0000-0000-000000000001', organisationName: 'VMS Pro', createdAt: '2026-01-02T00:00:00', updatedAt: null },
      { id: '00000000-0000-0000-0000-000000000003', fullName: 'Jane Doe', email: 'jane@vmspro.com', phone: '+1234567892', roleId: '00000000-0000-0000-0000-000000000003', roleName: 'Receptionist', status: 0, organisationId: '00000000-0000-0000-0000-000000000001', organisationName: 'VMS Pro', createdAt: '2026-01-03T00:00:00', updatedAt: null },
      { id: '00000000-0000-0000-0000-000000000004', fullName: 'Bob Wilson', email: 'bob@vmspro.com', phone: '+1234567893', roleId: '00000000-0000-0000-0000-000000000004', roleName: 'Security', status: 1, organisationId: '00000000-0000-0000-0000-000000000001', organisationName: 'VMS Pro', createdAt: '2026-01-04T00:00:00', updatedAt: null },
      { id: '00000000-0000-0000-0000-000000000005', fullName: 'Alice Brown', email: 'alice@vmspro.com', phone: '+1234567894', roleId: '00000000-0000-0000-0000-000000000002', roleName: 'Manager', status: 0, organisationId: '00000000-0000-0000-0000-000000000001', organisationName: 'VMS Pro', createdAt: '2026-01-05T00:00:00', updatedAt: null },
      { id: '00000000-0000-0000-0000-000000000006', fullName: 'Charlie Davis', email: 'charlie@vmspro.com', phone: '+1234567895', roleId: '00000000-0000-0000-0000-000000000003', roleName: 'Receptionist', status: 0, organisationId: '00000000-0000-0000-0000-000000000001', organisationName: 'VMS Pro', createdAt: '2026-01-06T00:00:00', updatedAt: null }
    ];

    const roles = [
      { id: 1, name: 'Super Admin', description: 'Full system access', usersCount: 1, permissions: { visitors: { view: true, create: true, edit: true, delete: true }, employees: { view: true, create: true, edit: true, delete: true }, tokens: { view: true, create: true, edit: true, delete: true }, admin: { view: true, create: true, edit: true, delete: true }, reports: { view: true, create: true, edit: true, delete: true }, settings: { view: true, create: true, edit: true, delete: true } } },
      { id: 2, name: 'Manager', description: 'Manage visitors and employees', usersCount: 2, permissions: { visitors: { view: true, create: true, edit: true, delete: false }, employees: { view: true, create: true, edit: true, delete: false }, tokens: { view: true, create: true, edit: true, delete: false }, admin: { view: false, create: false, edit: false, delete: false }, reports: { view: true, create: false, edit: false, delete: false }, settings: { view: true, create: false, edit: false, delete: false } } },
      { id: 3, name: 'Receptionist', description: 'Front desk operations', usersCount: 2, permissions: { visitors: { view: true, create: true, edit: true, delete: false }, employees: { view: true, create: false, edit: false, delete: false }, tokens: { view: true, create: true, edit: false, delete: false }, admin: { view: false, create: false, edit: false, delete: false }, reports: { view: false, create: false, edit: false, delete: false }, settings: { view: false, create: false, edit: false, delete: false } } },
      { id: 4, name: 'Security', description: 'Gate & security operations', usersCount: 1, permissions: { visitors: { view: true, create: false, edit: false, delete: false }, employees: { view: true, create: false, edit: false, delete: false }, tokens: { view: true, create: false, edit: false, delete: false }, admin: { view: false, create: false, edit: false, delete: false }, reports: { view: false, create: false, edit: false, delete: false }, settings: { view: false, create: false, edit: false, delete: false } } }
    ];

    const permissions = [
      { id: 1, key: 'visitors.view', module: 'Visitor Management', action: 'View', roles: ['Super Admin', 'Manager', 'Receptionist', 'Security'] },
      { id: 2, key: 'visitors.create', module: 'Visitor Management', action: 'Create', roles: ['Super Admin', 'Manager', 'Receptionist'] },
      { id: 3, key: 'visitors.edit', module: 'Visitor Management', action: 'Edit', roles: ['Super Admin', 'Manager', 'Receptionist'] },
      { id: 4, key: 'visitors.delete', module: 'Visitor Management', action: 'Delete', roles: ['Super Admin'] },
      { id: 5, key: 'employees.view', module: 'Employee Management', action: 'View', roles: ['Super Admin', 'Manager', 'Receptionist', 'Security'] },
      { id: 6, key: 'employees.create', module: 'Employee Management', action: 'Create', roles: ['Super Admin', 'Manager'] },
      { id: 7, key: 'employees.edit', module: 'Employee Management', action: 'Edit', roles: ['Super Admin', 'Manager'] },
      { id: 8, key: 'employees.delete', module: 'Employee Management', action: 'Delete', roles: ['Super Admin'] },
      { id: 9, key: 'tokens.view', module: 'Token Management', action: 'View', roles: ['Super Admin', 'Manager', 'Receptionist', 'Security'] },
      { id: 10, key: 'tokens.create', module: 'Token Management', action: 'Create', roles: ['Super Admin', 'Manager', 'Receptionist'] },
      { id: 11, key: 'tokens.edit', module: 'Token Management', action: 'Edit', roles: ['Super Admin', 'Manager'] },
      { id: 12, key: 'tokens.delete', module: 'Token Management', action: 'Delete', roles: ['Super Admin'] },
      { id: 13, key: 'admin.view', module: 'User Admin', action: 'View', roles: ['Super Admin'] },
      { id: 14, key: 'admin.create', module: 'User Admin', action: 'Create', roles: ['Super Admin'] },
      { id: 15, key: 'admin.edit', module: 'User Admin', action: 'Edit', roles: ['Super Admin'] },
      { id: 16, key: 'admin.delete', module: 'User Admin', action: 'Delete', roles: ['Super Admin'] },
      { id: 17, key: 'reports.view', module: 'Reports', action: 'View', roles: ['Super Admin', 'Manager'] },
      { id: 18, key: 'reports.create', module: 'Reports', action: 'Create', roles: ['Super Admin'] },
      { id: 19, key: 'reports.edit', module: 'Reports', action: 'Edit', roles: ['Super Admin'] },
      { id: 20, key: 'reports.delete', module: 'Reports', action: 'Delete', roles: ['Super Admin'] },
      { id: 21, key: 'settings.view', module: 'Settings', action: 'View', roles: ['Super Admin', 'Manager'] },
      { id: 22, key: 'settings.create', module: 'Settings', action: 'Create', roles: ['Super Admin'] },
      { id: 23, key: 'settings.edit', module: 'Settings', action: 'Edit', roles: ['Super Admin'] },
      { id: 24, key: 'settings.delete', module: 'Settings', action: 'Delete', roles: ['Super Admin'] }
    ];

    const visitors = [
      { id: 1, name: 'Michael Johnson', idType: 'Passport', idNumber: 'P12345678', phone: '+1987654321', purpose: 'Business Meeting', hostId: 1, hostName: 'John Smith', photo: null, checkIn: '2026-03-16T09:00:00', checkOut: null, status: 'checked-in', tokenId: 1, expectedDuration: '2 hours', orgType: 'Corporate Office' },
      { id: 2, name: 'Sarah Williams', idType: 'Driver License', idNumber: 'DL987654', phone: '+1987654322', purpose: 'Interview', hostId: 2, hostName: 'Jane Doe', photo: null, checkIn: '2026-03-16T10:30:00', checkOut: '2026-03-16T12:00:00', status: 'checked-out', tokenId: 2, expectedDuration: '1.5 hours', orgType: 'Corporate Office' },
      { id: 3, name: 'David Lee', idType: 'National ID', idNumber: 'NID456789', phone: '+1987654323', purpose: 'Delivery', hostId: 3, hostName: 'Bob Wilson', photo: null, checkIn: '2026-03-16T08:15:00', checkOut: null, status: 'checked-in', tokenId: 3, expectedDuration: '30 minutes', orgType: 'Factory' },
      { id: 4, name: 'Emily Chen', idType: 'Passport', idNumber: 'P87654321', phone: '+1987654324', purpose: 'Doctor Visit', hostId: 4, hostName: 'Dr. Alice Brown', photo: null, checkIn: '2026-03-16T11:00:00', checkOut: null, status: 'checked-in', tokenId: 4, expectedDuration: '1 hour', orgType: 'Hospital' },
      { id: 5, name: 'Robert Taylor', idType: 'Driver License', idNumber: 'DL123456', phone: '+1987654325', purpose: 'Maintenance', hostId: 5, hostName: 'Charlie Davis', photo: null, checkIn: '2026-03-15T14:00:00', checkOut: '2026-03-15T17:00:00', status: 'checked-out', tokenId: 5, expectedDuration: '3 hours', orgType: 'Residential Tower' },
      { id: 6, name: 'Lisa Anderson', idType: 'National ID', idNumber: 'NID789012', phone: '+1987654326', purpose: 'Guest Visit', hostId: 1, hostName: 'John Smith', photo: null, checkIn: '2026-03-16T13:00:00', checkOut: null, status: 'pending', tokenId: null, expectedDuration: '2 hours', orgType: 'Corporate Office' },
      { id: 7, name: 'James Martinez', idType: 'Passport', idNumber: 'P11223344', phone: '+1987654327', purpose: 'Conference', hostId: 2, hostName: 'Jane Doe', photo: null, checkIn: '2026-03-16T09:30:00', checkOut: null, status: 'checked-in', tokenId: 6, expectedDuration: '4 hours', orgType: 'Corporate Office' }
    ];

    const tokens = [
      { id: 1, tokenNo: 'TK-2026-0001', visitorId: 1, visitorName: 'Michael Johnson', type: 'General', issueTime: '2026-03-16T09:00:00', expiry: '2026-03-16T11:00:00', status: 'active', hostName: 'John Smith' },
      { id: 2, tokenNo: 'TK-2026-0002', visitorId: 2, visitorName: 'Sarah Williams', type: 'Guest', issueTime: '2026-03-16T10:30:00', expiry: '2026-03-16T12:30:00', status: 'expired', hostName: 'Jane Doe' },
      { id: 3, tokenNo: 'TK-2026-0003', visitorId: 3, visitorName: 'David Lee', type: 'Delivery', issueTime: '2026-03-16T08:15:00', expiry: '2026-03-16T09:15:00', status: 'active', hostName: 'Bob Wilson' },
      { id: 4, tokenNo: 'TK-2026-0004', visitorId: 4, visitorName: 'Emily Chen', type: 'Doctor Visit', issueTime: '2026-03-16T11:00:00', expiry: '2026-03-16T12:00:00', status: 'active', hostName: 'Dr. Alice Brown' },
      { id: 5, tokenNo: 'TK-2026-0005', visitorId: 5, visitorName: 'Robert Taylor', type: 'Maintenance', issueTime: '2026-03-15T14:00:00', expiry: '2026-03-15T17:00:00', status: 'expired', hostName: 'Charlie Davis' },
      { id: 6, tokenNo: 'TK-2026-0006', visitorId: 7, visitorName: 'James Martinez', type: 'General', issueTime: '2026-03-16T09:30:00', expiry: '2026-03-16T13:30:00', status: 'active', hostName: 'Jane Doe' }
    ];

    const appointments = [
      { id: 1, visitorName: 'Michael Johnson', hostId: 1, hostName: 'John Smith', date: '2026-03-17', time: '10:00', purpose: 'Project Review', notes: 'Bring project documents', status: 'confirmed' },
      { id: 2, visitorName: 'Sarah Williams', hostId: 2, hostName: 'Jane Doe', date: '2026-03-17', time: '14:00', purpose: 'Interview Round 2', notes: 'Technical interview', status: 'confirmed' },
      { id: 3, visitorName: 'David Lee', hostId: 3, hostName: 'Bob Wilson', date: '2026-03-18', time: '09:00', purpose: 'Equipment Delivery', notes: 'Loading dock access needed', status: 'pending' },
      { id: 4, visitorName: 'Emily Chen', hostId: 4, hostName: 'Dr. Alice Brown', date: '2026-03-18', time: '11:30', purpose: 'Follow-up Consultation', notes: '', status: 'confirmed' },
      { id: 5, visitorName: 'New Visitor', hostId: 1, hostName: 'John Smith', date: '2026-03-19', time: '15:00', purpose: 'Sales Presentation', notes: 'Conference room B', status: 'pending' }
    ];

    const employees = [
      { id: 1, name: 'John Smith', department: 'Engineering', designation: 'Senior Engineer', employeeId: 'EMP-001', status: 'active', phone: '+1111111111', email: 'john@company.com' },
      { id: 2, name: 'Jane Doe', department: 'Human Resources', designation: 'HR Manager', employeeId: 'EMP-002', status: 'active', phone: '+1111111112', email: 'jane@company.com' },
      { id: 3, name: 'Bob Wilson', department: 'Security', designation: 'Security Lead', employeeId: 'EMP-003', status: 'active', phone: '+1111111113', email: 'bob@company.com' },
      { id: 4, name: 'Alice Brown', department: 'Medical', designation: 'Chief Doctor', employeeId: 'EMP-004', status: 'active', phone: '+1111111114', email: 'alice@company.com' },
      { id: 5, name: 'Charlie Davis', department: 'Maintenance', designation: 'Facility Manager', employeeId: 'EMP-005', status: 'active', phone: '+1111111115', email: 'charlie@company.com' },
      { id: 6, name: 'Diana Ross', department: 'Engineering', designation: 'Junior Engineer', employeeId: 'EMP-006', status: 'inactive', phone: '+1111111116', email: 'diana@company.com' },
      { id: 7, name: 'Edward Kim', department: 'Finance', designation: 'Accountant', employeeId: 'EMP-007', status: 'active', phone: '+1111111117', email: 'edward@company.com' }
    ];

    const hosts = [
      { id: 1, name: 'John Smith', unit: 'Engineering - Floor 3', contact: '+1111111111', orgType: 'Corporate Office', status: 'active' },
      { id: 2, name: 'Jane Doe', unit: 'HR - Floor 2', contact: '+1111111112', orgType: 'Corporate Office', status: 'active' },
      { id: 3, name: 'Bob Wilson', unit: 'Gate 1 - Security', contact: '+1111111113', orgType: 'Factory', status: 'active' },
      { id: 4, name: 'Dr. Alice Brown', unit: 'Ward A - Cardiology', contact: '+1111111114', orgType: 'Hospital', status: 'active' },
      { id: 5, name: 'Charlie Davis', unit: 'Tower B - Apt 502', contact: '+1111111115', orgType: 'Residential Tower', status: 'active' },
      { id: 6, name: 'Frank Miller', unit: 'IT - Floor 4', contact: '+1111111116', orgType: 'Corporate Office', status: 'inactive' }
    ];

    const organizations = [
      { id: 1, type: 'Hospital', name: 'City General Hospital', address: '123 Medical Drive' },
      { id: 2, type: 'Residential Tower', name: 'Skyline Apartments', address: '456 Tower Ave' },
      { id: 3, type: 'Corporate Office', name: 'TechCorp HQ', address: '789 Business Blvd' },
      { id: 4, type: 'Factory', name: 'AutoMakers Plant', address: '321 Industrial Way' }
    ];

    return { users, roles, permissions, visitors, tokens, appointments, employees, hosts, organizations };
  }
}
