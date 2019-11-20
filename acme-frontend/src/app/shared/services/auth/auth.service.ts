import { Inject , Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ApiService } from '../api/api';

@Injectable()
export class AuthService {
    constructor(public router: Router, @Inject(DOCUMENT) private document: any, private api: ApiService) {}

    login(params) {
        return this.api.post('login', params);
    }

}
