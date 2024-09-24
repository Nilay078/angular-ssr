import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import Utils from 'src/app/utility/utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { KeyValue } from 'src/app/common/interfaces/entities/entity';
import { PrivateService } from '../private.service';
import { ListResponse } from 'src/app/common/interfaces/response';
import { Line100PercentBy150Theme } from 'src/app/constant/skeleton-theme';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
    selector: 'app-news-newsletter-alerts',
    templateUrl: './news-newsletter-alerts.component.html',
    styleUrls: ['./news-newsletter-alerts.component.scss'],
    providers: [PrivateService],
})
export class NewsNewsletterAlertsComponent implements OnInit, OnDestroy {
    changeResolutionFlag!: boolean;
    newsNotifications!: boolean;
    newsForm: FormGroup;
    newsView: any;
    utils = Utils;
    breadcrumbs: KeyValue[] = [];
    newsletterList: any[] = [];
    newsRelatedList = [
        { value: 'Newsletters', key: 1 },
        { value: 'News Notifications', key: 2 },
    ];
    newsAlerts = 1;
    selectedNews: any[] = [];
    hasNewsletter = true;
    theme = Line100PercentBy150Theme;
    newsRelatedListDesktop = [
        { key: 1, value: 'Newsletters', selected: true },
        { key: 2, value: 'News Notifications', selected: false },
    ];

    constructor(
        private headerActiveService: HeaderActiveService,
        private router: Router,
        private fb: FormBuilder,
        private privateService: PrivateService,
        private cookieService: SsrCookieService
    ) {
        this.newsForm = this.fb.group({
            newsletter: [null],
        });
        this.breadcrumbs = [
            { key: 'Home', value: Url.HOME },
            { key: 'News & Newsletters Alerts', value: '' },
        ];
    }

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('previousUrl', Url.MY_ACCOUNT);
        this.searchNewsletter();
    }

    searchNewsletter() {
        this.hasNewsletter = false;
        this.privateService
            .newsletterSearch()
            .then((response: ListResponse) => {
                this.newsletterList = response.list;
            })
            .finally(() => {
                this.hasNewsletter = true;
            });
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.MY_ACCOUNT]);
    }

    onChange(event: any, newsletter: any) {
        console.log(event);
        console.log(newsletter);
    }

    onNewsRelatedChange(event: any) {
        if (event.value === 1) {
            this.newsNotifications = false;
        } else {
            this.newsNotifications = true;
        }
    }

    selectionChange(news: any) {
        _.forEach(this.newsRelatedListDesktop, (newsView: any) => {
            newsView.selected = false;
            if (newsView.key === news.key) {
                newsView.selected = true;
            }
        });
        this.newsNotifications = this.newsRelatedListDesktop[0].selected ? false : true;
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
    }
}
