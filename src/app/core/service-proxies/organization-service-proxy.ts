import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult } from '../models';
import { OrganisationDto, CreateOrganisationDto, UpdateOrganisationDto } from '../models/organization.model';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Organisations;

@Injectable({ providedIn: 'root' })
export class OrganizationServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<OrganisationDto>>> {
     let inputParams: Record<string, any> = { page, pageSize };
    if (search.trim().length > 0) {
      inputParams['search'] = search;
    }
    return this.Get<ApiResponse<PagedResult<OrganisationDto>>>(EP, 'GetAll', inputParams);
  }

  getById(id: string): Observable<ApiResponse<OrganisationDto>> {
    return this.Get<ApiResponse<OrganisationDto>>(EP, 'GetById', { id });
  }

  create(dto: CreateOrganisationDto): Observable<ApiResponse<OrganisationDto>> {
    return this.Post<ApiResponse<OrganisationDto>>(EP, 'Create', dto);
  }

  update(id: string, dto: UpdateOrganisationDto): Observable<ApiResponse<OrganisationDto>> {
    return this.PutWithParams<ApiResponse<OrganisationDto>>(EP, 'Update', dto, { id });
  }

  delete(id: string): Observable<ApiResponse<object>> {
    return this.Delete<ApiResponse<object>>(EP, 'Delete', { id });
  }
}
