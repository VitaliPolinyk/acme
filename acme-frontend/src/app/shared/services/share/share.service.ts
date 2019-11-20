import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api';

@Injectable()
export class ShareService {
    constructor(private router: Router, private api: ApiService) {}

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/logout']);
    }
}
