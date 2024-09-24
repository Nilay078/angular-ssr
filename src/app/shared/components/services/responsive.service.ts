import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
    providedIn: 'root',
})
export class ResponsiveService {
    constructor(private breakpointObserver: BreakpointObserver, private cookieService: SsrCookieService) {}

    onChangeResolution() {
        this.breakpointObserver.observe(['(min-width: 0) and (max-width: 767px)']).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.cookieService.delete('isMobile');
                this.cookieService.set('isMobile', 'true', { path: '/' });
            } else {
                this.cookieService.delete('isMobile');
                this.cookieService.set('isMobile', 'false', { path: '/' });
            }
        });
    }
}
