import { FormControl } from '@angular/forms';
import { ValidationResult } from './validation-result';

export class PasswordValidator {

    public static hasLower(control: FormControl): ValidationResult {
        const hasLower = /[a-zа-я]/.test(control.value);

        if (!hasLower) {
            return { hasLower: true };
        }

        return null;
    }

    public static hasUpper(control: FormControl): ValidationResult {
        const hasUpper = /[A-ZА-Я]/.test(control.value);

        if (!hasUpper) {
            return { hasUpper: true };
        }

        return null;
    }

    public static hasNumber(control: FormControl): ValidationResult {
        const hasNumber = /\d/.test(control.value);

        if (!hasNumber) {
            return { hasNumber: true };
        }

        return null;
    }
}
