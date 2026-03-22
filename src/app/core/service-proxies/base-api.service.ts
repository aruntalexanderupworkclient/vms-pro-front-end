import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResult } from '../models';
import { EndpointPair } from '../config/api-endpoints.const';

/**
 * Base API Service
 * ────────────────
 * Dual-mode HTTP helper that every domain service-proxy extends.
 *
 * ── Mode switch (environment.useInMemoryApi) ─────────────────────────
 *
 *  TRUE  → In-memory mode
 *          URL pattern:  /api/{collection}  or  /api/{collection}/{id}
 *          angular-in-memory-web-api intercepts these.
 *          Raw responses are wrapped into ApiResponse / PagedResult
 *          so component code stays identical in both modes.
 *
 *  FALSE → Real API mode
 *          URL pattern:  {apiUrl}/{Controller}/{Action}[?queryParams]
 *          Backend already returns ApiResponse<T> / ApiResponse<PagedResult<T>>.
 *
 * ── EndpointPair (auto-switches based on environment) ────────────────
 *
 *  Every method takes an EndpointPair from ApiEndpoints as the first arg.
 *  The pair holds BOTH names: { inMemory: 'visitors', api: 'Visitors' }
 *  BaseApiService picks the right one based on environment.useInMemoryApi.
 *
 * ── Method catalogue ─────────────────────────────────────────────────
 *  Get<T>             — GET    JSON response
 *  GetBlob            — GET    Blob (file download)
 *  Post<T>            — POST   JSON body
 *  PostForm<T>        — POST   FormData body (file upload)
 *  Put<T>             — PUT    JSON body only ([FromBody])
 *  PutWithParams<T>   — PUT    JSON body + query params ([FromQuery] & [FromBody])
 *  Patch<T>           — PATCH  JSON body only ([FromBody])
 *  PatchWithParams<T> — PATCH  JSON body + query params ([FromQuery] & [FromBody])
 *  Delete<T>          — DELETE with optional query params
 *  DeleteWithBody<T>  — DELETE with JSON body + optional query params
 *
 * ── Query parameter handling ──────────────────────────────────────────
 * For APIs that use [FromQuery] and/or [FromBody] in the action signature:
 *
 *  • Only [FromBody]:
 *    userServiceProxy.Put(ep, 'Update', {id: 1, name: 'John'})
 *
 *  • Only [FromQuery]:
 *    userServiceProxy.PutWithParams(ep, 'Update', {}, {id: '123', status: 'active'})
 *
 *  • Both [FromQuery] & [FromBody]:
 *    [HttpPut("Update")] Update([FromQuery] Guid id, [FromBody] UpdateUserDto dto)
 *    userServiceProxy.PutWithParams(ep, 'Update', {name: 'John'}, {id: '123'})
 *
 * ── In-memory Mode Query Params ───────────────────────────────────────
 * When using PutWithParams/PatchWithParams with query params:
 *  • If 'id' is ONLY in query params: PUT /api/{collection}?id=123&other=value
 *  • If 'id' is in body: PUT /api/{collection}/123 (uses path)
 *  • Other query params are appended to URL query string
 *
 * ── inputParams ──────────────────────────────────────────────────────
 * Always a plain Record<string, any>.
 * Converted to Angular HttpParams internally via toHttpParams().
 * Callers never need to import or construct HttpParams.
 */
@Injectable()
export abstract class BaseApiService {

  private readonly isInMemory: boolean;
  private readonly apiBaseUrl: string;

  constructor(protected http: HttpClient) {
    this.isInMemory = environment.useInMemoryApi;
    this.apiBaseUrl = (environment.apiUrl ?? '').replace(/\/+$/, '');
  }

  // ── URL builders ───────────────────────────────────────────────────

  /**
   * Real API URL:  {apiUrl}/{controller}/{action}
   */
  private buildApiUrl(ep: EndpointPair, action: string): string {
    return `${this.apiBaseUrl}/${ep.api}/${action}`;
  }

  /**
   * In-memory URL:  /api/{collection}  or  /api/{collection}/{id}
   * Uses ep.inMemory — the exact collection name from ApiEndpoints.
   */
  private buildInMemoryUrl(ep: EndpointPair, id?: number | string): string {
    let url = `/api/${ep.inMemory}`;
    if (id !== undefined && id !== null) {
      url += `/${id}`;
    }
    return url;
  }

  /**
   * In-memory URL with query params:  /api/{collection}?param1=value1&param2=value2
   * Appends query parameters to the in-memory URL for [FromQuery] scenarios.
   */
  private buildInMemoryUrlWithParams(
    ep: EndpointPair,
    inputParams?: Record<string, any>
  ): string {
    let url = `/api/${ep.inMemory}`;
    const httpParams = this.toHttpParams(inputParams);
    const queryString = httpParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    return url;
  }

  // ── Param helpers ──────────────────────────────────────────────────

  /**
   * Converts a plain object into Angular HttpParams.
   * null / undefined values are silently skipped.
   */
  private toHttpParams(inputParams?: Record<string, any>): HttpParams {
    let params = new HttpParams();
    if (inputParams) {
      Object.keys(inputParams).forEach(key => {
        const value = inputParams[key];
        if (value !== null && value !== undefined) {
          params = params.set(key, String(value));
        }
      });
    }
    return params;
  }

  // ── In-memory response wrappers ────────────────────────────────────

  /**
   * Wraps a single item into ApiResponse<T>.
   */
  private wrapSingle<T>(source$: Observable<T>): Observable<ApiResponse<T>> {
    return source$.pipe(
      map(data => ({
        success: true,
        message: 'Success',
        data,
        errors: []
      }))
    );
  }

  /**
   * Wraps an array into ApiResponse<PagedResult<T>>.
   * Applies client-side paging to simulate server-side pagination.
   */
  private wrapPaged<T>(
    source$: Observable<T[]>,
    page: number,
    pageSize: number
  ): Observable<ApiResponse<PagedResult<T>>> {
    return source$.pipe(
      map(items => {
        const totalCount = items.length;
        const totalPages = Math.ceil(totalCount / pageSize) || 1;
        const start = (page - 1) * pageSize;
        const paged = items.slice(start, start + pageSize);

        return {
          success: true,
          message: 'Success',
          data: {
            items: paged,
            totalCount,
            page,
            pageSize,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages
          } as PagedResult<T>,
          errors: []
        };
      })
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  GET
  // ═══════════════════════════════════════════════════════════════════

  /**
   * GET — JSON response
   *
   * Real API  →  GET {apiUrl}/{ep.api}/{action}?params
   * In-memory →  GET /api/{ep.inMemory}         (paged wrapper)
   *              GET /api/{ep.inMemory}/{id}     (single wrapper)
   */
  protected Get<T>(
    ep: EndpointPair,
    action: string,
    inputParams?: Record<string, any>
  ): Observable<T> {
    if (this.isInMemory) {
      return this.inMemoryGet<T>(ep, inputParams);
    }
    return this.http.get<T>(this.buildApiUrl(ep, action), {
      params: this.toHttpParams(inputParams)
    });
  }

  /**
   * Routes in-memory GET to the right wrapper based on params.
   */
  private inMemoryGet<T>(
    ep: EndpointPair,
    inputParams?: Record<string, any>
  ): Observable<T> {
    const id = inputParams?.['id'];

    // Single-item fetch: GET /api/{collection}/{id}
    if (id !== undefined && id !== null) {
      const url = this.buildInMemoryUrl(ep, id);
      return this.wrapSingle(this.http.get<any>(url)) as unknown as Observable<T>;
    }

    // List fetch: GET /api/{collection} → wrap into PagedResult
    const page = inputParams?.['page'] ?? 1;
    const pageSize = inputParams?.['pageSize'] ?? 10;
    const url = this.buildInMemoryUrl(ep);
    return this.wrapPaged(
      this.http.get<any[]>(url),
      +page,
      +pageSize
    ) as unknown as Observable<T>;
  }

  // ═══════════════════════════════════════════════════════════════════
  //  GET (Blob — file download)
  // ═══════════════════════════════════════════════════════════════════

  /**
   * GET → Blob
   * In-memory mode: returns an empty Blob (in-memory API can't serve files).
   */
  protected GetBlob(
    ep: EndpointPair,
    action: string,
    inputParams?: Record<string, any>
  ): Observable<Blob> {
    if (this.isInMemory) {
      return of(new Blob());
    }
    return this.http.get(this.buildApiUrl(ep, action), {
      params: this.toHttpParams(inputParams),
      responseType: 'blob'
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  POST
  // ═══════════════════════════════════════════════════════════════════

  /**
   * POST — JSON body
   *
   * Real API  →  POST {apiUrl}/{ep.api}/{action}
   * In-memory →  POST /api/{ep.inMemory}
   */
  protected Post<T>(
    ep: EndpointPair,
    action: string,
    body: any
  ): Observable<T> {
    console.log('POST body:', body); // Debug log for POST request body
    if (this.isInMemory) {
      const url = this.buildInMemoryUrl(ep);
      return this.wrapSingle(this.http.post<any>(url, body)) as unknown as Observable<T>;
    }
    return this.http.post<T>(this.buildApiUrl(ep, action), body);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  POST (FormData — file upload)
  // ═══════════════════════════════════════════════════════════════════

  /**
   * POST — FormData body
   * Content-Type is NOT set manually — browser auto-sets multipart boundary.
   */
  protected PostForm<T>(
    ep: EndpointPair,
    action: string,
    formData: FormData
  ): Observable<T> {
    if (this.isInMemory) {
      const url = this.buildInMemoryUrl(ep);
      return this.wrapSingle(this.http.post<any>(url, formData)) as unknown as Observable<T>;
    }
    return this.http.post<T>(this.buildApiUrl(ep, action), formData);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  PUT
  // ═══════════════════════════════════════════════════════════════════

  /**
   * PUT — JSON body
   *
   * Use this method when the API expects [FromBody] only.
   * If the API needs [FromQuery] parameters, use PutWithParams() instead.
   *
   * Real API  →  PUT {apiUrl}/{ep.api}/{action}
   * In-memory →  PUT /api/{ep.inMemory}/{body.id}
   */
  protected Put<T>(
    ep: EndpointPair,
    action: string,
    body: any
  ): Observable<T> {
    console.log('PUT body:', body); // Debug log for PUT request body
    if (this.isInMemory) {
      const url = this.buildInMemoryUrl(ep, body?.id);
      return this.wrapSingle(this.http.put<any>(url, body)) as unknown as Observable<T>;
    }
    return this.http.put<T>(this.buildApiUrl(ep, action), body);
  }

  /**
   * PUT — JSON body + query params
   *
   * Handles [FromQuery] & [FromBody] scenarios:
   *  • ID in query param: call PutWithParams(ep, action, body, {id: '123'})
   *  • ID in body:       call PutWithParams(ep, action, {id: '123', ...data})
   *  • Only [FromBody]:  call Put(ep, action, body)
   *
   * Real API  →  PUT {apiUrl}/{ep.api}/{action}?params with body
   * In-memory →  PUT /api/{ep.inMemory}/{id}?otherParams  or  PUT /api/{ep.inMemory}?params (if id in query)
   *              Uses query param 'id' if present, otherwise falls back to body.id
   */
  protected PutWithParams<T>(
    ep: EndpointPair,
    action: string,
    body: any,
    inputParams?: Record<string, any>
  ): Observable<T> {
    if (this.isInMemory) {
      // Check if 'id' is in query params first (for [FromQuery] scenarios)
      const idFromParams = inputParams?.['id'];
      const idFromBody = body?.id;
      const id = idFromParams ?? idFromBody;

      // If id is in query params but not in body, use query string URL
      if (idFromParams && !idFromBody) {
        const url = this.buildInMemoryUrlWithParams(ep, inputParams);
        return this.wrapSingle(this.http.put<any>(url, body)) as unknown as Observable<T>;
      }

      // If id is in body or params, use path-based URL (traditional style)
      const url = this.buildInMemoryUrl(ep, id);
      return this.wrapSingle(this.http.put<any>(url, body)) as unknown as Observable<T>;
    }

    return this.http.put<T>(this.buildApiUrl(ep, action), body, {
      params: this.toHttpParams(inputParams)
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  PATCH
  // ═══════════════════════════════════════════════════════════════════

  /**
   * PATCH — JSON body
   * In-memory: treated as PUT (angular-in-memory-web-api doesn't differentiate).
   * Use this for [FromBody] only scenarios.
   */
  protected Patch<T>(
    ep: EndpointPair,
    action: string,
    body: any
  ): Observable<T> {
    if (this.isInMemory) {
      const url = this.buildInMemoryUrl(ep, body?.id);
      return this.wrapSingle(this.http.put<any>(url, body)) as unknown as Observable<T>;
    }
    return this.http.patch<T>(this.buildApiUrl(ep, action), body);
  }

  /**
   * PATCH — JSON body + query params
   *
   * Handles [FromQuery] & [FromBody] scenarios (same as PutWithParams):
   *  • ID in query param: call PatchWithParams(ep, action, body, {id: '123'})
   *  • ID in body:       call PatchWithParams(ep, action, {id: '123', ...data})
   *
   * Real API  →  PATCH {apiUrl}/{ep.api}/{action}?params with body
   * In-memory →  PUT /api/{ep.inMemory}/{id}?otherParams  or  PUT /api/{ep.inMemory}?params (if id in query)
   */
  protected PatchWithParams<T>(
    ep: EndpointPair,
    action: string,
    body: any,
    inputParams?: Record<string, any>
  ): Observable<T> {
    if (this.isInMemory) {
      // Check if 'id' is in query params first (for [FromQuery] scenarios)
      const idFromParams = inputParams?.['id'];
      const idFromBody = body?.id;
      const id = idFromParams ?? idFromBody;

      // If id is in query params but not in body, use query string URL
      if (idFromParams && !idFromBody) {
        const url = this.buildInMemoryUrlWithParams(ep, inputParams);
        return this.wrapSingle(this.http.put<any>(url, body)) as unknown as Observable<T>;
      }

      // If id is in body or params, use path-based URL (traditional style)
      const url = this.buildInMemoryUrl(ep, id);
      return this.wrapSingle(this.http.put<any>(url, body)) as unknown as Observable<T>;
    }

    return this.http.patch<T>(this.buildApiUrl(ep, action), body, {
      params: this.toHttpParams(inputParams)
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DELETE
  // ═══════════════════════════════════════════════════════════════════

  /**
   * DELETE — with optional query params
   *
   * Real API  →  DELETE {apiUrl}/{ep.api}/{action}?params
   * In-memory →  DELETE /api/{ep.inMemory}/{id}
   */
  protected Delete<T>(
    ep: EndpointPair,
    action: string,
    inputParams?: Record<string, any>
  ): Observable<T> {
    if (this.isInMemory) {
      const id = inputParams?.['id'] ?? inputParams?.['documentId'];
      const url = this.buildInMemoryUrl(ep, id);
      return this.wrapSingle(this.http.delete<any>(url)) as unknown as Observable<T>;
    }
    return this.http.delete<T>(this.buildApiUrl(ep, action), {
      params: this.toHttpParams(inputParams)
    });
  }

  /**
   * DELETE — with JSON body + optional query params
   */
  protected DeleteWithBody<T>(
    ep: EndpointPair,
    action: string,
    body: any,
    inputParams?: Record<string, any>
  ): Observable<T> {
    if (this.isInMemory) {
      const id = body?.id ?? inputParams?.['id'];
      const url = this.buildInMemoryUrl(ep, id);
      return this.wrapSingle(this.http.delete<any>(url)) as unknown as Observable<T>;
    }
    return this.http.request<T>('DELETE', this.buildApiUrl(ep, action), {
      body,
      params: this.toHttpParams(inputParams)
    });
  }
}
