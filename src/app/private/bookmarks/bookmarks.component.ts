/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl, Url } from 'src/app/constant/app-url';
import { FilterComponent } from '../filter/filter.component';
import { HomeService } from 'src/app/public/home.service';
import { ListResponse } from 'src/app/common/interfaces/response';
import { FilterService } from 'src/app/shared/components/services/filter.service';
import * as _ from 'lodash';
import Utils from 'src/app/utility/utils';
import { Line100PercentBy150Theme } from 'src/app/constant/skeleton-theme';
import { KeyValue } from 'src/app/common/interfaces/entities/entity';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { AuthorService } from 'src/app/shared/components/services/author.service';
import { ArticleType } from 'src/app/shared/enums/article-type-enum';

@Component({
    selector: 'app-bookmarks',
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.scss'],
    providers: [HomeService],
})
export class BookmarksComponent implements OnInit, OnDestroy {
    appUrl = Url;
    apiUrl = ApiUrl;
    changeResolutionFlag!: boolean;
    currentDate!: string;
    endDate!: string;
    categoryList: any[] = [];
    bookmarkList: any[] = [];
    filteredData: any;
    hasBookmark!: boolean;
    utils = Utils;
    bookmarkArticleList: any[] = [];
    hasData = false;
    theme = Line100PercentBy150Theme;
    hasFilter = false;
    breadcrumbs: KeyValue[] = [];
    articleType = ArticleType;

    constructor(
        private router: Router,
        private headerActiveService: HeaderActiveService,
        private modalService: NgbModal,
        private homeService: HomeService,
        private filterService: FilterService,
        private cookieService: SsrCookieService,
        public authorService: AuthorService
    ) {
        this.breadcrumbs = [
            { key: 'Home', value: Url.HOME },
            { key: 'Bookmark', value: '' },
        ];
    }

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('previousUrl', Url.MY_ACCOUNT);
        this.filterService.filterDataView.subscribe((data: any) => {
            this.filteredData = data;
            this.onSearch();
        });
    }

    async onSearch() {
        this.hasData = false;
        this.hasBookmark = true;
        this.categoryList = [];
        this.currentDate = this.filteredData?.dateValue?.fromDate;
        this.endDate = this.filteredData?.dateValue?.endDate;
        await _.forEach(this.filteredData?.categoryValue, (category: any) => {
            this.categoryList.push(category.id);
        });
        this.homeService
            .searchBookmark(this.currentDate, this.endDate, this.categoryList)
            .then((response: ListResponse) => {
                this.bookmarkList = response.list;
                if (this.bookmarkList.length >= 7) {
                    this.filteredData = true;
                }
                const date = new Date();
                let dummyList: any[] = [];
                let dummyDiff = 0;
                this.bookmarkArticleList = [];
                const data: any = {};
                _.forEach(this.bookmarkList, (article: any, i: number) => {
                    const selectDate = this.utils.fromEpochToDate(article.createDate);
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
                            this.bookmarkArticleList.push(dummy);
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
                            this.bookmarkArticleList.push(dummy);
                            dummyList = [];
                        }
                        if (data.dateType === 'Yesterday') {
                            const dummy: any = {};
                            dummy.type = { key: 1, value: data.dateType };
                            dummy.value = dummyList;
                            this.bookmarkArticleList.push(dummy);
                            dummyList = [];
                        }
                        if (dummyDiff === dateDiff) {
                            data.dateType = article.createDate;
                            dummyList.push(article);
                        }
                        if (dummyDiff === 0) {
                            dummyDiff = dateDiff;
                            data.dateType = article.createDate;
                            dummyList.push(article);
                        }
                        if (dummyDiff !== dateDiff) {
                            const dummy: any = {};
                            dummy.type = { key: 2, value: data.dateType };
                            dummy.value = dummyList;
                            this.bookmarkArticleList.push(dummy);
                            dummyList = [];
                            dummyDiff = dateDiff;
                            data.dateType = article.createDate;
                            dummyList.push(article);
                        }
                    }
                    if (i === this.bookmarkList.length - 1) {
                        const dummy: any = {};
                        if (dateDiff >= 2) {
                            dummy.type = { key: 2, value: data.dateType };
                        } else {
                            dummy.type = { key: 1, value: data.dateType };
                        }
                        dummy.value = dummyList;
                        this.bookmarkArticleList.push(dummy);
                    }
                });
                if (this.bookmarkList.length === 0) {
                    this.hasBookmark = false;
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

    onOpen() {
        this.modalService.open(FilterComponent, { backdrop: 'static', size: 'lg', centered: true });
    }

    onBookmark(articleId: number) {
        this.homeService.saveBookmark(articleId).then(() => {
            this.onSearch();
        });
    }

    onAdd() {
        this.router.navigate([Url.HOME]);
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
    }
}
