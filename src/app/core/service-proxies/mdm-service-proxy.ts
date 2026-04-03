import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';
import { MdmDto, CreateMdmDto, UpdateMdmDto } from '../models/mdm.model';

/**
 * MDM Service Proxy
 * ─────────────────
 * Handles all MDM (Master Data Management) API calls.
 *
 * The MDM controller uses a {type} path segment:
 *   api/Mdm/{type}/GetAll
 *   api/Mdm/{type}/GetById?id={guid}
 *   api/Mdm/{type}/Create
 *   api/Mdm/{type}/Update?id={guid}
 *   api/Mdm/{type}/Delete?id={guid}
 */
@Injectable({ providedIn: 'root' })
export class MdmServiceProxy {

    private readonly apiBaseUrl: string;

    constructor(private http: HttpClient) {
        this.apiBaseUrl = (environment.apiUrl ?? '').replace(/\/+$/, '');
    }

    private buildUrl(type: string, action: string): string {
        return `${this.apiBaseUrl}/Mdm/${type}/${action}`;
    }

    getAll(type: string): Observable<ApiResponse<MdmDto[]>> {
        return this.http.get<ApiResponse<MdmDto[]>>(this.buildUrl(type, 'GetAll'));
    }

    getById(type: string, id: string): Observable<ApiResponse<MdmDto>> {
        return this.http.get<ApiResponse<MdmDto>>(this.buildUrl(type, 'GetById'), {
            params: new HttpParams().set('id', id)
        });
    }

    create(type: string, payload: CreateMdmDto): Observable<ApiResponse<MdmDto>> {
        return this.http.post<ApiResponse<MdmDto>>(this.buildUrl(type, 'Create'), payload);
    }

    update(type: string, id: string, payload: UpdateMdmDto): Observable<ApiResponse<MdmDto>> {
        return this.http.put<ApiResponse<MdmDto>>(this.buildUrl(type, 'Update'), payload, {
            params: new HttpParams().set('id', id)
        });
    }

    delete(type: string, id: string): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(this.buildUrl(type, 'Delete'), {
            params: new HttpParams().set('id', id)
        });
    }
}
