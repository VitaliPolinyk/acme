import {throwError as observableThrowError, Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {Injectable, OnInit} from '@angular/core';
import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';
import {Router} from '@angular/router';


import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';


@Injectable()
export class ApiService {

    public headers: HttpHeaders = new HttpHeaders();
    URL = environment.backend_url;

    constructor(
        public http: HttpClient,
        public router: Router
    ) {
    }

    public get(path: string) {
        return this.http.get<any>(`${this.URL}${path}`, this.getDefaultOptions()).pipe(
            map(this.getJson),
            catchError(this.catchErr));
    }


    public post(path: string, body: any, options?: any): Observable<any> {
        return this.http.post(
            `${this.URL}${path}`,
            body,
            this.getDefaultOptions(options)
        ).pipe(
            catchError(this.catchErr),
            map(this.getJson));
    }

    public put(path: string, body: any, options?: any): Observable<any> {
        return this.http.put(
            `${this.URL}${path}`,
            JSON.stringify(body),
            this.getDefaultOptions(options)
        ).pipe(
            catchError(this.catchErr),
            map(this.getJson));
    }

    public delete(path: string): Observable<any> {
        return this.http.delete(`${this.URL}${path}`, this.getDefaultOptions()).pipe(
            catchError(this.catchErr),
            map(this.getJson));
    }

    public setHeaders(headers) {
        Object.keys(headers)
            .forEach((header: any) => this.headers.set(header, headers[header]));
    }

    public getJson(resp: any) {
        const r: any = _.clone(resp);
        /**
         * Handle empty _body response
         */
        return r && r._body && r._body.length ? resp.json() : resp;
    }

    public catchErr(err: any) {
        if (err.status === 401) {
            /**
             * If 401 not authorized. Return response and perform some action.
             */
            // localStorage.clear();
            // location.replace('/login');
        }
        if (err && err._body && typeof err._body === 'string') {
            const errBody: any = JSON.parse(err._body);
            err.message = errBody && errBody.error && errBody.error.message ?
                errBody.error.message : 'Error.';
        }
        return observableThrowError(err);
    }

    protected getDefaultOptions(optionalHeaders?: any): any {
        const headers: any = new HttpHeaders(optionalHeaders || {
            Accept: 'application/json',
            'Content-type': 'application/json'
        });
        return {headers};
    }
}
