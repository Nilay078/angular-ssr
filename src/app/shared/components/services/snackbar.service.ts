import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackbarComponent } from '../mat-snackbar/mat-snackbar.component';

@Injectable({
    providedIn: 'root',
})
export class SnackBarService {
    readonly DEFAULT_DISPLAY_SECONDS = 4000;
    constructor(private matSnackBar: MatSnackBar) {}

    public errorSnackBar(message: string) {
        this.matSnackBar.openFromComponent(
            MatSnackbarComponent,
            MatSnackbarComponent.getErrorConfig(message, this.DEFAULT_DISPLAY_SECONDS)
        );
    }

    public successSnackBar(message: string) {
        this.matSnackBar.openFromComponent(
            MatSnackbarComponent,
            MatSnackbarComponent.getSuccessConfig(message, this.DEFAULT_DISPLAY_SECONDS)
        );
    }
}
