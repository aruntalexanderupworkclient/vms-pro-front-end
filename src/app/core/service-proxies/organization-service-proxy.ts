import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, Organization } from '../models';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Organizations;

@Injectable({ providedIn: 'root' })
export class OrganizationServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllOrganizations(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<Organization>>> {
    return this.Get<ApiResponse<PagedResult<Organization>>>(EP, 'GetAll', { page, pageSize, search });
  }

  getOrganizationById(id: number): Observable<ApiResponse<Organization>> {
    return this.Get<ApiResponse<Organization>>(EP, 'GetById', { id });
  }

  createOrganization(org: Organization): Observable<ApiResponse<Organization>> {
    return this.Post<ApiResponse<Organization>>(EP, 'Create', org);
  }

  updateOrganization(id: number, org: Organization): Observable<ApiResponse<Organization>> {
    return this.Put<ApiResponse<Organization>>(EP, 'Update', { ...org, id });
  }

  deleteOrganization(id: number): Observable<ApiResponse<void>> {
    return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
  }
}
