import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { ViewResponse } from './common/interfaces/response';
import { Url } from './constant/app-url';
import { HttpService } from './services/http.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        public jwtHelper: JwtHelperService,
        private router: Router,
        private httpService: HttpService,
        private cookieService: SsrCookieService
    ) {}

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        const authToken: string = this.cookieService.get('auth-token');
        const refreshToken: string = this.cookieService.get('refresh-token');
        if (authToken) {
            const expired: boolean = this.jwtHelper.isTokenExpired(authToken);
            if (expired) {
                if (this.jwtHelper.isTokenExpired(refreshToken)) {
                    this.cookieService.deleteAll();
                    this.router.navigate([Url.HOME]);
                    return false;
                } else {
                    const data = { accessToken: authToken, refreshToken: refreshToken };
                    this.httpService
                        .postAuth<ViewResponse>(`${environment.apiUrl}/private/user/get-access-token`, data)
                        .then((response: ViewResponse) => {
                            if (response.accessToken) {
                                this.cookieService.delete('auth-token');
                                const expiredDate = new Date();
                                expiredDate.setDate(expiredDate.getDate() + 90);
                                this.cookieService.set('auth-token', response.accessToken, expiredDate);
                                return true;
                            } else {
                                return false;
                            }
                        });
                    return false;
                }
            } else {
                return true;
            }
        } else {
            this.router.navigate([Url.HOME]);
            return false;
        }
    }
}
