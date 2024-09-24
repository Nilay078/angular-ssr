import { Router } from '@angular/router';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Url } from 'src/app/constant/app-url';
import { HomeService } from 'src/app/public/home.service';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
    providers: [HomeService],
})
export class MyAccountComponent implements OnInit, OnDestroy {
    appUrl = Url;
    changeResolutionFlag!: boolean;
    userView: any;
    currentDate = Date.now();

    constructor(
        private router: Router,
        private headerActiveService: HeaderActiveService,
        private homeService: HomeService,
        private cookieService: SsrCookieService
    ) {}

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        if (!this.changeResolutionFlag && this.router.url === Url.MY_ACCOUNT) {
            this.router.navigate([this.appUrl.HOME]);
        }
        this.cookieService.set('previousUrl', Url.MORE);
        const userId: any = this.cookieService.get('userId');
        this.homeService.userView(userId).then((response: ViewResponse) => {
            this.userView = response.view;
        });
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.MORE]);
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
        this.headerActiveService.changeActiveClass(false);
    }
}
