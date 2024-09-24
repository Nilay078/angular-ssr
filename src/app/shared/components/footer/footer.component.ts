import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Component, OnInit } from '@angular/core';
import { AppUrlConstant, Url } from 'src/app/constant/app-url';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    headerShow!: boolean;
    changeResolutionFlag!: boolean;
    appUrl = Url;
    isHidden!: boolean;
    social_media_url = AppUrlConstant;
    currentYear = new Date().getFullYear();

    constructor(private headerActiveService: HeaderActiveService, private cookieService: SsrCookieService, private router: Router) {}

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.headerActiveService.activeHeader.subscribe(activeClass => {
            this.headerShow = activeClass;
        });
        this.headerActiveService.openHeader.subscribe((isOpen: boolean) => {
            this.isHidden = isOpen;
        });
        this.headerActiveService.hideFooter.subscribe((isHide: boolean) => {
            this.isHidden = isHide;
        });
    }

    gotoHome() {
        this.router.navigate([Url.HOME]);
    }
}
