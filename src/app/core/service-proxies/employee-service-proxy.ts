import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, Employee } from '../models';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Employees;

@Injectable({ providedIn: 'root' })
export class EmployeeServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllEmployees(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<Employee>>> {
    let inputParams: Record<string, any> = { page, pageSize };
    if (search.trim().length > 0) {
      inputParams['search'] = search;
    }
    return this.Get<ApiResponse<PagedResult<Employee>>>(EP, 'GetAll', inputParams);
  }

  getEmployeeById(id: number): Observable<ApiResponse<Employee>> {
    return this.Get<ApiResponse<Employee>>(EP, 'GetById', { id });
  }

  createEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.Post<ApiResponse<Employee>>(EP, 'Create', employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<ApiResponse<Employee>> {
    return this.PutWithParams<ApiResponse<Employee>>(EP, 'Update', employee, { id });
  }

  deleteEmployee(id: number): Observable<ApiResponse<void>> {
    return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
  }
}
