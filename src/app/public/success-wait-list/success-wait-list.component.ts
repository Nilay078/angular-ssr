import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { AppUrlConstant, Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';

@Component({
    selector: 'app-success-wait-list',
    templateUrl: './success-wait-list.component.html',
    styleUrls: ['./success-wait-list.component.scss'],
})
export class SuccessWaitListComponent implements OnInit, OnDestroy {
    waitListMessage: any;
    changeResolutionFlag!: boolean;
    social_media_url = AppUrlConstant;

    constructor(private headerActiveService: HeaderActiveService, private router: Router, private cookieService: SsrCookieService) {}

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        this.headerActiveService.changeOpenHeader(true);
        this.headerActiveService.changeActiveHeader(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.waitListMessage = this.cookieService.get('waitListMessage');
    }

    onContinue() {
        this.router.navigate([Url.EXCLUSIVE_LOGIN]);
    }

    ngOnDestroy(): void {
        this.headerActiveService.changeOpenHeader(false);
    }
}
