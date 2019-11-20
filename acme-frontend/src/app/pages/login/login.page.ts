import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ToastsService } from '../../shared/services/toasts/toasts.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {

    loginForm: FormGroup;
    submitted = false;

    constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private toastService: ToastsService) {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email,
                Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
            password: ['', [Validators.required]]
        });
    }

    ngOnInit() {

    }

    get f() {
        return this.loginForm.controls;
    }

    handleSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        this.authService.login(this.loginForm.value).subscribe((data) => {
            if (data) {
                localStorage.setItem('token', data.token);
                this.router.navigate(['events']);
                this.toastService.presentToast('You successful sign in');
            }
        }, ({error}) => {
            this.toastService.presentToast(error.message);
        });
    }
}
