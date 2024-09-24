import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
    selector: 'app-mat-snackbar',
    templateUrl: './mat-snackbar.component.html',
})
export class MatSnackbarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackbar: MatSnackBar) {}

    public static getErrorConfig(message: string, displaySeconds: number): MatSnackBarConfig {
        return {
            data: {
                text: message,
                class: 'error-snackbar-box',
                titleClass: 'error-snackbar-txt',
                type: 'Error',
            },
            duration: displaySeconds,
        };
    }

    public static getSuccessConfig(message: string, displaySeconds: number): MatSnackBarConfig {
        return {
            data: {
                text: message,
                class: 'success-snackbar-box',
                titleClass: 'success-snackbar-txt',
                type: 'Success',
            },
            duration: displaySeconds,
        };
    }
}
