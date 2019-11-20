import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastsService {
    constructor(public toastController: ToastController) {}



    async presentToast(text) {
        const toast = await this.toastController.create({
            message: `${text}`,
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
}
