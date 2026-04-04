import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, Token } from '../models';
import { ApiEndpoints } from '../config';
import { ScanTokenDto } from '../models/token.model';

const EP = ApiEndpoints.Tokens;

@Injectable({ providedIn: 'root' })
export class TokenServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllTokens(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<Token>>> {
    let inputParams: Record<string, any> = { page, pageSize };
    if (search.trim().length > 0) {
      inputParams['search'] = search;
    }
    return this.Get<ApiResponse<PagedResult<Token>>>(EP, 'GetAll', inputParams);
  }

  getTokenById(id: string): Observable<ApiResponse<Token>> {
    return this.Get<ApiResponse<Token>>(EP, 'GetById', { id });
  }

  scan(id: string): Observable<ApiResponse<ScanTokenDto>> {
    return this.Get<ApiResponse<ScanTokenDto>>(EP, 'Scan', { id });
  }

  createToken(token: Token): Observable<ApiResponse<Token>> {
    return this.Post<ApiResponse<Token>>(EP, 'Create', token);
  }

  updateToken(id: number, token: Token): Observable<ApiResponse<Token>> {
    return this.PutWithParams<ApiResponse<Token>>(EP, 'Update', token, { id });
  }

  deleteToken(id: number): Observable<ApiResponse<void>> {
    return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
  }
}
