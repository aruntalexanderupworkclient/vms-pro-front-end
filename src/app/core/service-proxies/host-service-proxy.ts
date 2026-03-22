import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, Host } from '../models';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Hosts;

@Injectable({ providedIn: 'root' })
export class HostServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllHosts(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<Host>>> {
    let inputParams: Record<string, any> = { page, pageSize };
    if (search.trim().length > 0) {
      inputParams['search'] = search;
    }
    return this.Get<ApiResponse<PagedResult<Host>>>(EP, 'GetAll', inputParams);
  }

  getHostById(id: number): Observable<ApiResponse<Host>> {
    return this.Get<ApiResponse<Host>>(EP, 'GetById', { id });
  }

  createHost(host: Host): Observable<ApiResponse<Host>> {
    return this.Post<ApiResponse<Host>>(EP, 'Create', host);
  }

  updateHost(id: number, host: Host): Observable<ApiResponse<Host>> {
    return this.PutWithParams<ApiResponse<Host>>(EP, 'Update',host, {id: id });
  }

  deleteHost(id: number): Observable<ApiResponse<void>> {
    return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
  }
}
