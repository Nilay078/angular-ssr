import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListResponse } from 'src/app/common/interfaces/response';
import { ApiUrl, Url } from 'src/app/constant/app-url';
import { HomeService } from 'src/app/public/home.service';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import * as _ from 'lodash';
import Utils from 'src/app/utility/utils';
import { Line100PercentBy150Theme } from 'src/app/constant/skeleton-theme';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { KeyValue } from 'src/app/common/interfaces/entities/entity';
import { AuthorService } from 'src/app/shared/components/services/author.service';
import { ArticleType } from 'src/app/shared/enums/article-type-enum';

@Component({
    selector: 'app-recent-view',
    templateUrl: './recent-view.component.html',
    styleUrls: ['./recent-view.component.scss'],
    providers: [HomeService],
})
export class RecentViewComponent implements OnInit, OnDestroy {
    changeResolutionFlag!: boolean;
    articleList: any[] = [];
    apiUrl = ApiUrl;
    token!: any;
    appUrl = Url;
    recentlyViewList: any[] = [];
    utils = Utils;
    hasData = false;
    hasRecentView!: boolean;
    theme = Line100PercentBy150Theme;
    breadcrumbs: KeyValue[] = [];
    articleType = ArticleType;

    constructor(
        private router: Router,
        private headerActiveService: HeaderActiveService,
        private homeService: HomeService,
        private cookieService: SsrCookieService,
        public authorService: AuthorService
    ) {
        this.breadcrumbs = [
            { key: 'Home', value: Url.HOME },
            { key: 'Recently Viewed', value: '' },
        ];
    }

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('previousUrl', Url.MY_ACCOUNT);
        this.token = this.cookieService.check('auth-token');
        this.onSearch();
    }

    onSearch() {
        this.hasData = false;
        this.hasRecentView = true;
        this.homeService
            .searchRecentView()
            .then((response: ListResponse) => {
                this.articleList = response.list;
                const date = new Date();
                let dummyList: any[] = [];
                let dummyDiff = 0;
                this.recentlyViewList = [];
                const data: any = {};
                _.forEach(this.articleList, (article: any, i: number) => {
                    const selectDate = this.utils.fromEpochToDate(article.viewDate);
                    const dateDiff = Math.floor(
                        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
                            Date.UTC(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate())) /
                            (1000 * 60 * 60 * 24)
                    );
                    if (dateDiff === 0) {
                        data.dateType = 'Today';
                        dummyList.push(article);
                    }
                    if (dateDiff === 1) {
                        if (data.dateType === 'Today') {
                            const dummy: any = {};
                            dummy.type = { key: 1, value: data.dateType };
                            dummy.value = dummyList;
                            this.recentlyViewList.push(dummy);
                            dummyList = [];
                        }
                        data.dateType = 'Yesterday';
                        dummyList.push(article);
                    }
                    if (dateDiff >= 2) {
                        if (data.dateType === 'Today') {
                            const dummy: any = {};
                            dummy.type = { key: 1, value: data.dateType };
                            dummy.value = dummyList;
                            this.recentlyViewList.push(dummy);
                            dummyList = [];
                        }
                        if (data.dateType === 'Yesterday') {
                            const dummy: any = {};
                            dummy.type = { key: 1, value: data.dateType };
                            dummy.value = dummyList;
                            this.recentlyViewList.push(dummy);
                            dummyList = [];
                        }
                        if (dummyDiff === dateDiff) {
                            data.dateType = article.viewDate;
                            dummyList.push(article);
                        }
                        if (dummyDiff === 0) {
                            dummyDiff = dateDiff;
                            data.dateType = article.viewDate;
                            dummyList.push(article);
                        }
                        if (dummyDiff !== dateDiff) {
                            const dummy: any = {};
                            dummy.type = { key: 2, value: data.dateType };
                            dummy.value = dummyList;
                            this.recentlyViewList.push(dummy);
                            dummyList = [];
                            dummyDiff = dateDiff;
                            data.dateType = article.viewDate;
                            dummyList.push(article);
                        }
                    }
                    if (i === this.articleList.length - 1) {
                        const dummy: any = {};
                        if (dateDiff >= 2) {
                            dummy.type = { key: 2, value: data.dateType };
                        } else {
                            dummy.type = { key: 1, value: data.dateType };
                        }
                        dummy.value = dummyList;
                        this.recentlyViewList.push(dummy);
                    }
                });
                if (this.articleList.length === 0) {
                    this.hasRecentView = false;
                }
            })
            .finally(() => {
                this.hasData = true;
            });
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.MY_ACCOUNT]);
    }

    onBookmark(articleId: number) {
        if (this.cookieService.check('auth-token')) {
            this.homeService.saveBookmark(articleId).then(() => {
                this.onSearch();
            });
        } else {
            this.router.navigate([Url.HOME]);
        }
    }

    onAdd() {
        this.router.navigate([Url.HOME]);
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
    }
}
