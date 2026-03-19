import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PagedResult, Appointment } from '../models';
import { ApiEndpoints } from '../config';

const EP = ApiEndpoints.Appointments;

@Injectable({ providedIn: 'root' })
export class AppointmentServiceProxy extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllAppointments(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponse<PagedResult<Appointment>>> {
    let inputParams: Record<string, any> = { page, pageSize };
    if (search.trim().length > 0) {
      inputParams['search'] = search;
    }
    return this.Get<ApiResponse<PagedResult<Appointment>>>(EP, 'GetAll', inputParams);
  }

  getAppointmentById(id: number): Observable<ApiResponse<Appointment>> {
    return this.Get<ApiResponse<Appointment>>(EP, 'GetById', { id });
  }

  createAppointment(appointment: Appointment): Observable<ApiResponse<Appointment>> {
    return this.Post<ApiResponse<Appointment>>(EP, 'Create', appointment);
  }

  updateAppointment(id: number, appointment: Appointment): Observable<ApiResponse<Appointment>> {
    return this.Put<ApiResponse<Appointment>>(EP, 'Update', { ...appointment, id });
  }

  deleteAppointment(id: number): Observable<ApiResponse<void>> {
    return this.Delete<ApiResponse<void>>(EP, 'Delete', { id });
  }
}
