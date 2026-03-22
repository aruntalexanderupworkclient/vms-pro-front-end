import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, EnumOptionDto, AllEnumsDto } from '../models';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Enums;

/**
 * Enum Service Proxy
 * ──────────────────
 * Handles all enum-related API calls for dropdowns and select lists.
 * provides methods to fetch enum options by type or all at once.
 */
@Injectable({ providedIn: 'root' })
export class EnumServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get all OrganisationType enum options for dropdowns
   * @returns Observable of API response containing list of organisation type options
   */
  getOrganisationTypes(): Observable<ApiResponse<EnumOptionDto[]>> {
    return this.Get<ApiResponse<EnumOptionDto[]>>(EP, 'OrganisationTypes');
  }

  /**
   * Get all UserStatus enum options for dropdowns
   * @returns Observable of API response containing list of user status options
   */
  getUserStatuses(): Observable<ApiResponse<EnumOptionDto[]>> {
    return this.Get<ApiResponse<EnumOptionDto[]>>(EP, 'UserStatuses');
  }

  /**
   * Get all TokenType enum options for dropdowns
   * @returns Observable of API response containing list of token type options
   */
  getTokenTypes(): Observable<ApiResponse<EnumOptionDto[]>> {
    return this.Get<ApiResponse<EnumOptionDto[]>>(EP, 'TokenTypes');
  }

  /**
   * Get all VisitStatus enum options for dropdowns
   * @returns Observable of API response containing list of visit status options
   */
  getVisitStatuses(): Observable<ApiResponse<EnumOptionDto[]>> {
    return this.Get<ApiResponse<EnumOptionDto[]>>(EP, 'VisitStatuses');
  }

  /**
   * Get all enum options grouped by type in a single call
   * Reduces the number of API requests when multiple enum types are needed
   * @returns Observable of API response containing dictionary of all enum types
   */
  getAllEnums(): Observable<ApiResponse<AllEnumsDto>> {
    return this.Get<ApiResponse<AllEnumsDto>>(EP, 'All');
  }
}
