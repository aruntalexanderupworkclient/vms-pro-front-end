import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, User } from '../models';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Users;

@Injectable({ providedIn: 'root' })
export class UserServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllUsers(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<User>>> {
    let inputParams: Record<string, any> = { page, pageSize };
    if (search.trim().length > 0) {
      inputParams['search'] = search;
    }
    return this.Get<ApiResponse<PagedResult<User>>>(EP, 'GetAll', inputParams);
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.Get<ApiResponse<User>>(EP, 'GetById', { id });
  }

  createUser(user: User): Observable<ApiResponse<User>> {
    return this.Post<ApiResponse<User>>(EP, 'Create', user);
  }

  updateUser(id: string, user: User): Observable<ApiResponse<User>> {
    return this.Put<ApiResponse<User>>(EP, 'Update', { ...user, id });
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
  }
}
