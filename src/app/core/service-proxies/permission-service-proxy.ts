import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, Permission } from '../models';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Permissions;

@Injectable({ providedIn: 'root' })
export class PermissionServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllPermissions(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<Permission>>> {
    let inputParams: Record<string, any> = { page, pageSize };
    if (search.trim().length > 0) {
      inputParams['search'] = search;
    }
    return this.Get<ApiResponse<PagedResult<Permission>>>(EP, 'GetAll', inputParams);
  }

  getPermissionById(id: number): Observable<ApiResponse<Permission>> {
    return this.Get<ApiResponse<Permission>>(EP, 'GetById', { id });
  }

  createPermission(permission: Permission): Observable<ApiResponse<Permission>> {
    return this.Post<ApiResponse<Permission>>(EP, 'Create', permission);
  }

  updatePermission(id: number, permission: Permission): Observable<ApiResponse<Permission>> {
    return this.Put<ApiResponse<Permission>>(EP, 'Update', { ...permission, id });
  }

  deletePermission(id: number): Observable<ApiResponse<void>> {
    return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
  }
}
