import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.handleRequests(req, next);
    }

    private handleRequests(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(this.addHeaders(req)).pipe(
            catchError(error => {
                return throwError(error);
            }));
    }

    private addHeaders(req: HttpRequest<any>) {
        let updatedReq: HttpRequest<any>;
        updatedReq = req.clone({
            headers: req.headers
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
        });
        return updatedReq;
    }
}