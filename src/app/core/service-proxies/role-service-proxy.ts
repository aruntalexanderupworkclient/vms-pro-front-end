import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, Role } from '../models';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Roles;

@Injectable({ providedIn: 'root' })
export class RoleServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllRoles(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<Role>>> {
    let inputParams: Record<string, any> = { page, pageSize };
    if (search.trim().length > 0) {
      inputParams['search'] = search;
    }
    return this.Get<ApiResponse<PagedResult<Role>>>(EP, 'GetAll', inputParams);
  }

  getRoleById(id: number): Observable<ApiResponse<Role>> {
    return this.Get<ApiResponse<Role>>(EP, 'GetById', { id });
  }

  createRole(role: Role): Observable<ApiResponse<Role>> {
    return this.Post<ApiResponse<Role>>(EP, 'Create', role);
  }

  updateRole(id: number, role: Role): Observable<ApiResponse<Role>> {
    return this.Put<ApiResponse<Role>>(EP, 'Update', { ...role, id });
  }

  deleteRole(id: number): Observable<ApiResponse<void>> {
    return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
  }
}
