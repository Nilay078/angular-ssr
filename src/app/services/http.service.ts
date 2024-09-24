import { SnackBarService } from './../shared/components/services/snackbar.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Response } from '../common/interfaces/response';
import { AppUrlConstant } from '../constant/app-url';
import { ErrorMessage } from '../constant/error-message';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { getWindow } from 'ssr-window';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private snackbarService: SnackBarService,
        private cookieService: SsrCookieService
    ) {}

    get<T extends Response>(path: string, handleErrInSpecComponent = false): Promise<T> {
        return lastValueFrom(this.http.get(path, { headers: this.getHeader() }))
            .then((response: object) => {
                const proResponse = response as T;
                if (proResponse.hasError && !handleErrInSpecComponent) {
                    this.snackbarService.errorSnackBar(proResponse.message);
                    return Promise.reject({} as T);
                }
                this.setOrUpdateToken(proResponse);
                return Promise.resolve(proResponse);
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleHttpErrorResponse(httpErrorResponse);
                return Promise.reject({} as T);
            });
    }

    post<T extends Response>(path: string, data: object, handleErrInSpecComponent = false): Promise<T> {
        return lastValueFrom(this.http.post(path, data, { headers: this.getHeader() }))
            .then((response: object) => {
                const proResponse = response as T;
                if (proResponse.hasError && !handleErrInSpecComponent) {
                    this.snackbarService.errorSnackBar(proResponse.message);
                    return Promise.reject({} as T);
                }
                this.setOrUpdateToken(proResponse);
                return Promise.resolve(proResponse);
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleHttpErrorResponse(httpErrorResponse);
                return Promise.reject({} as T);
            });
    }

    getAuth<T extends Response>(path: string, handleErrInSpecComponent = false): Promise<T> {
        return lastValueFrom(this.http.get(path, { headers: this.getHeader() }))
            .then((response: object) => {
                const proResponse = response as T;
                if (proResponse.hasError && !handleErrInSpecComponent) {
                    this.snackbarService.errorSnackBar(proResponse.message);
                    return Promise.reject({} as T);
                }
                this.setOrUpdateToken(proResponse);
                return Promise.resolve(proResponse);
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleHttpErrorResponse(httpErrorResponse);
                return Promise.reject({} as T);
            });
    }

    deleteAuth<T extends Response>(path: string, handleErrInSpecComponent = false): Promise<T> {
        return lastValueFrom(this.http.delete(path, { headers: this.getHeader() }))
            .then((response: object) => {
                const proResponse = response as T;
                if (proResponse.hasError && !handleErrInSpecComponent) {
                    this.snackbarService.errorSnackBar(proResponse.message);
                    return Promise.reject({} as T);
                }
                this.setOrUpdateToken(proResponse);
                return Promise.resolve(proResponse);
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleHttpErrorResponse(httpErrorResponse);
                return Promise.reject({} as T);
            });
    }

    postAuth<T extends Response>(path: string, data: object, handleErrInSpecComponent = false): Promise<T> {
        return lastValueFrom(this.http.post(path, data, { headers: this.getHeader() }))
            .then((response: object) => {
                const proResponse = response as T;
                if (proResponse.hasError && !handleErrInSpecComponent) {
                    this.snackbarService.errorSnackBar(proResponse.message);
                    return Promise.reject({} as T);
                }
                this.setOrUpdateToken(proResponse);
                return Promise.resolve(proResponse);
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleHttpErrorResponse(httpErrorResponse);
                return Promise.reject({} as T);
            });
    }

    putAuth<T extends Response>(path: string, data: object, handleErrInSpecComponent = false): Promise<T> {
        return lastValueFrom(this.http.put(path, data, { headers: this.getHeader() }))
            .then((response: object) => {
                const proResponse = response as T;
                if (proResponse.hasError && !handleErrInSpecComponent) {
                    this.snackbarService.errorSnackBar(proResponse.message);
                    return Promise.reject({} as T);
                }
                this.setOrUpdateToken(proResponse);
                return Promise.resolve(proResponse);
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleHttpErrorResponse(httpErrorResponse);
                return Promise.reject({} as T);
            });
    }

    private handleHttpErrorResponse(httpErrorResponse: HttpErrorResponse): void {
        if (!httpErrorResponse.error) {
            return;
        }
        switch (httpErrorResponse.status) {
            case 500:
                this.snackbarService.errorSnackBar(httpErrorResponse.error.message);
                break;
            case 404:
                this.snackbarService.errorSnackBar(httpErrorResponse.message);
                break;
            case 401:
                this.cookieService.deleteAll();
                getWindow().location.reload();
                this.snackbarService.errorSnackBar(httpErrorResponse.error.message);
                break;
            case 403:
                this.snackbarService.errorSnackBar(httpErrorResponse.error.message);
                this.router.navigate([AppUrlConstant.UNAUTHORIZED]);
                break;
            case 502:
                this.snackbarService.errorSnackBar(ErrorMessage.unAuthorization);
                break;
            case 0:
                this.snackbarService.errorSnackBar(ErrorMessage.unAuthorization);
                break;
            default:
                this.snackbarService.errorSnackBar(httpErrorResponse.message);
                break;
        }
    }

    private setOrUpdateToken(response: Response): void {
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 7);
        if (response.accessToken) {
            this.cookieService.delete('auth-token');
            this.cookieService.set('auth-token', response.accessToken, expiredDate);
        }
        if (response.refreshToken) {
            this.cookieService.delete('refresh-token');
            this.cookieService.set('refresh-token', response.refreshToken, expiredDate);
        }
    }

    private getHeader() {
        return new HttpHeaders({
            Authorization: this.cookieService.check('auth-token') ? 'Bearer ' + this.cookieService.get('auth-token') : '',
            refreshToken: this.cookieService.check('refresh-token') ? 'Bearer ' + this.cookieService.get('refresh-token') : '',
            exclusiveCodeToken: this.cookieService.check('exclusive-token') ? 'Bearer ' + this.cookieService.get('exclusive-token') : '',
        });
    }
}
