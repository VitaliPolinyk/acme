import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { ShareService } from '../share/share.service';
import { catchError, filter, finalize, take, switchMap, tap } from 'rxjs/operators';
import { paths } from './const';
import { ApiService } from '../api/api';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    private AUTH_HEADER = 'Authorization';
    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private api: ApiService, private router: Router, private shareService: ShareService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.url.includes(paths.login)) {
            return next.handle(req);
        }

        req = this.addAuthenticationToken(req);
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error) {
                    if (error.status === 401) {
                        // 401 errors are most likely going to be because we have an expired token that we need to refresh.
                        if (this.refreshTokenInProgress) {
                            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                            // which means the new token is ready and we can retry the request again
                            if (req.url.includes(paths.refreshToken)) {
                                this.shareService.logout();
                                this.router.navigateByUrl('/sign-in').then(r => {
                                    return;
                                });
                            }

                            return this.refreshTokenSubject.pipe(
                                filter(result => result !== null),
                                take(1),
                                switchMap(() => next.handle(this.addAuthenticationToken(req)))
                            );
                        } else {
                            this.refreshTokenInProgress = true;
                            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                            this.refreshTokenSubject.next(null);

                            return this.refreshAccessToken().pipe(
                                switchMap((success: boolean) => {
                                    this.refreshTokenSubject.next(success);
                                    return next.handle(this.addAuthenticationToken(req));
                                }),
                                // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                                // for the next time the token needs to be refreshed
                                finalize(() => (this.refreshTokenInProgress = false))
                            );
                        }
                    } else {
                        return throwError(error);
                    }
                } else {
                    return throwError(error);
                }
            })
        );
    }

    private refreshAccessToken(): Observable<any> {
      return this.api.post(`/refresh-token/`, {'refreshToken': localStorage.getItem('refreshToken')}).pipe(tap((data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('expiredAt', data.expiredAt);
        }));
    }

    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        // If we do not have a token yet then we should not set the header.
        // Here we could first retrieve the token from where we store it.
        if (!localStorage.getItem('token')) {
            return request;
        }
        // If you are calling an outside domain then do not add the token.
        // if (!request.url.match(/www.mydomain.com\//)) {
        //     return request;
        // }
        return request.clone({
            headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + localStorage.getItem('token'))
        });
    }
}
