import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Component, OnInit } from '@angular/core';
import { Url } from 'src/app/constant/app-url';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    url!: boolean;
    changeResolutionFlag!: boolean;
    appUrl = Url;

    constructor(private headerActiveService: HeaderActiveService, private cookieService: SsrCookieService, public router: Router) {}

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.headerActiveService.activeClass.subscribe(activeClass => {
            this.url = activeClass;
        });
    }
}
