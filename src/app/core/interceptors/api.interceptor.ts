import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = sessionStorage.getItem('vms_user');
    let headers = req.headers;

    // Only set Content-Type for non-FormData requests (FormData needs browser-generated boundary)
    if (!(req.body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.id != null) {
          headers = headers.set('X-User-Id', String(parsed.id));
        }
        if (parsed.role != null) {
          headers = headers.set('X-User-Role', String(parsed.role));
        }
      } catch (e) {
        console.warn('ApiInterceptor: failed to parse vms_user from sessionStorage', e);
      }
    }

    const cloned = req.clone({ headers });
    return next.handle(cloned);
  }
}
