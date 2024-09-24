/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { getWindow } from 'ssr-window';
import { ResponsiveService } from './shared/components/services/responsive.service';
import { PrivateService } from './private/private.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationSelectionComponent } from './public/location-selection/location-selection.component';
import { ViewResponse } from './common/interfaces/response';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [PrivateService],
})
export class AppComponent {
    title = 'the-secretariat-website';
    splashScreenFlag = false;
    routerEventSubscription: Subscription | undefined;

    constructor(
        private responsiveService: ResponsiveService,
        private privateService: PrivateService,
        private router: Router,
        private cookieService: SsrCookieService,
        private modalService: NgbModal
    ) {
        if (getWindow().location.pathname === '/') {
            this.splashScreenFlag = true;
        }
        this.responsiveService.onChangeResolution();
        this.routerEventSubscription = this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                if (
                    cookieService.check('auth-token') &&
                    (!cookieService.check('stateUpdated') || !JSON.parse(cookieService.get('stateUpdated')))
                ) {
                    this.stateSelection();
                }
            }
        });
    }

    private stateSelection() {
        this.privateService.userData(JSON.parse(this.cookieService.get('userId'))).then((response: ViewResponse) => {
            const userView: any = response.view;
            if (userView.stateView) {
                this.cookieService.set('state', JSON.stringify(userView.stateView));
            }
            if (!userView.stateUpdated) {
                this.modalService.open(LocationSelectionComponent, { backdrop: 'static', size: 'lg', centered: true, keyboard: false });
            }
        });
    }
}
