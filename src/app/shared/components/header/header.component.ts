/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderActiveService } from '../services/header-active-class-service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Url } from 'src/app/constant/app-url';
import { NavigationEnd, Router } from '@angular/router';
import { RegistrationComponent } from 'src/app/public/registration/registration.component';
import { MoreMenuComponent } from 'src/app/public/more-menu/more-menu.component';
import Utils from 'src/app/utility/utils';
import { LoginComponent } from 'src/app/public/login/login.component';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ArticleSearchService } from '../services/article-search.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FeedbackService } from '../services/feedback.service';
import { SEOService } from 'src/app/seo.service';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PrivateService } from 'src/app/private/private.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [PrivateService],
})
export class HeaderComponent implements OnInit, OnDestroy {
    @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
    articleSearchForm: FormGroup;
    url!: boolean;
    headerShow!: boolean;
    isSearched!: boolean;
    appUrl = Url;
    changeResolutionFlag!: boolean;
    userView!: any;
    currentDate = Date.now();
    utils = Utils;
    isSearch = true;
    filteredOptions: any[] = [];
    isOpen = true;
    previousUrl = '';
    isHidden!: boolean;
    routerEventSubscription: Subscription | undefined;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private fb: FormBuilder,
        private headerActiveService: HeaderActiveService,
        public router: Router,
        private modalService: NgbModal,
        private cookieService: SsrCookieService,
        private articleSearchService: ArticleSearchService,
        private feedbackService: FeedbackService,
        private seoService: SEOService
    ) {
        this.articleSearchForm = this.fb.group({
            articleSearch: [null],
        });
        this.previousUrl = cookieService.get('previousUrl');
        this.routerEventSubscription = this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.seoService.setCanonicalLink(environment.website + this.router.url);
            }
        });
    }

    ngOnInit(): void {
        const currentUrl = this.router.url.split('/');
        if (currentUrl[1] === this.appUrl.ARTICLE_SEARCH) {
            currentUrl[2] = currentUrl[2]
                .split('-')
                .filter(function (item) {
                    item = item ? item.replace(/-/g, '') : item;
                    return item;
                })
                .join(' ');
            this.articleSearchForm.controls['articleSearch'].setValue(currentUrl[2]);
            this.openSearch();
        }
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.headerActiveService.activeClass.subscribe(activeClass => {
            this.url = activeClass;
        });
        this.headerActiveService.activeHeader.subscribe(activeClass => {
            this.headerShow = activeClass;
        });
        this.headerActiveService.userView.subscribe((user: any) => {
            this.userView = user;
        });
        this.headerActiveService.activeSearchBar.subscribe((searchBar: boolean) => {
            this.isSearched = searchBar;
            if (searchBar === false) {
                this.articleSearchForm.reset();
            }
        });
        this.headerActiveService.openHeader.subscribe((isOpen: boolean) => {
            this.isHidden = isOpen;
        });
        if (!this.userView) {
            this.userView = {};
            this.userView.firstName = this.cookieService.get('userFirstName') ?? '';
            this.userView.lastName = this.cookieService.get('userLastName') ?? '';
            this.userView.mobile = this.cookieService.get('userMobile') ?? '';
        }
        if (!this.cookieService.check('userFirstName') && !this.cookieService.check('device-token')) {
            this.isOpen = false;
        }
    }

    openRegister() {
        this.modalService.open(RegistrationComponent, { backdrop: 'static', size: 'lg', centered: true });
    }

    openLogin() {
        this.modalService.open(LoginComponent, { backdrop: 'static', size: 'lg', centered: true });
    }

    gotoMenu() {
        this.modalService.open(MoreMenuComponent, {
            modalDialogClass: 'right-side-modal',
            scrollable: true,
        });
    }

    openSearch() {
        if (this.articleSearchForm.controls['articleSearch'].value) {
            this.isSearch = false;
            const slugUrl = this.articleSearchForm.controls['articleSearch'].value
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            this.router.navigate([this.appUrl.ARTICLE_SEARCH + '/' + slugUrl]);
            this.cookieService.delete('searchSlug');
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + 7);
            this.cookieService.set('searchSlug', this.articleSearchForm.controls['articleSearch'].value, expiredDate);
            this.articleSearchService.changeSearch(this.articleSearchForm.controls['articleSearch'].value);
        }
    }

    onSearch() {
        let dummy!: string;
        this.articleSearchService.changeSearch(dummy);
        this.router.navigate([this.appUrl.ARTICLE_SEARCH + '/']);
    }

    onClose() {
        const previousUrl = this.cookieService.get('previousUrl');
        if (previousUrl === Url.MORE) {
            this.url = false;
        }
        if (this.router.url === '/' + Url.FEEDBACK) {
            this.feedbackService.changeFeedbackType(true);
        }
        this.router.navigate([previousUrl]);
    }

    ngOnDestroy(): void {
        this.routerEventSubscription?.unsubscribe();
        this.destroy$.next(true);
    }
}
