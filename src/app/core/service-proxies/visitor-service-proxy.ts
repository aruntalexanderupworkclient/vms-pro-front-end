import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, Visitor } from '../models';
import { ApiEndpoints } from '../config';

/** Endpoint pair — auto-resolves in-memory vs real API name */
const EP = ApiEndpoints.Visitors;

@Injectable({ providedIn: 'root' })
export class VisitorServiceProxy extends BaseApiService {

    constructor(http: HttpClient) {
        super(http);
    }

    // ── Standard CRUD ──────────────────────────────────────────────────

    getAllVisitors(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<Visitor>>> {

        let inputParams: Record<string, any> = { page, pageSize };
        if (search.trim().length > 0) {
            inputParams['search'] = search;
        }
        return this.Get<ApiResponse<PagedResult<Visitor>>>(EP, 'GetAll', inputParams);
    }

    getVisitorById(id: number): Observable<ApiResponse<Visitor>> {
        return this.Get<ApiResponse<Visitor>>(EP, 'GetById', { id });
    }

    createVisitor(visitor: Visitor): Observable<ApiResponse<Visitor>> {
        return this.Post<ApiResponse<Visitor>>(EP, 'Create', visitor);
    }

    updateVisitor(id: number, visitor: Visitor): Observable<ApiResponse<Visitor>> {
        return this.Put<ApiResponse<Visitor>>(EP, 'Update', { ...visitor, id });
    }

    deleteVisitor(id: number): Observable<ApiResponse<void>> {
        return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
    }

    // ── Pinpoint action endpoints ──────────────────────────────────────

    /** GET /api/Visitors/GetDocuments?visitorId=… */
    getVisitorDocuments(visitorId: number): Observable<ApiResponse<any[]>> {
        return this.Get<ApiResponse<any[]>>(EP, 'GetDocuments', { visitorId });
    }

    /** GET /api/Visitors/DownloadDocument?id=…  → Blob */
    downloadDocument(docId: number): Observable<Blob> {
        return this.GetBlob(EP, 'DownloadDocument', { id: docId });
    }

    /** GET /api/Visitors/GetByEmail?email=… */
    getVisitorByEmail(email: string): Observable<ApiResponse<Visitor>> {
        return this.Get<ApiResponse<Visitor>>(EP, 'GetByEmail', { email });
    }

    /** POST /api/Visitors/UploadPhoto  (FormData) */
    uploadVisitorPhoto(visitorId: number, formData: FormData): Observable<ApiResponse<any>> {
        formData.append('visitorId', String(visitorId));
        return this.PostForm<ApiResponse<any>>(EP, 'UploadPhoto', formData);
    }

    /** DELETE /api/Visitors/DeleteDocuments?documentId=… */
    deleteVisitorDocument(documentId: number): Observable<ApiResponse<void>> {
        return this.Delete<ApiResponse<void>>(EP, 'DeleteDocuments', { documentId });
    }

    /** POST /api/Visitors/CheckIn */
    checkInVisitor(body: { visitorId: number }): Observable<ApiResponse<Visitor>> {
        return this.Post<ApiResponse<Visitor>>(EP, 'CheckIn', body);
    }

    /** POST /api/Visitors/CheckOut */
    checkOutVisitor(body: { visitorId: number }): Observable<ApiResponse<Visitor>> {
        return this.Post<ApiResponse<Visitor>>(EP, 'CheckOut', body);
    }

    /** GET /api/Visitors/GetByHost?hostId=…&page=…&pageSize=… */
    getVisitorsByHost(hostId: number, page: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResult<Visitor>>> {
        return this.Get<ApiResponse<PagedResult<Visitor>>>(EP, 'GetByHost', { hostId, page, pageSize });
    }
}
