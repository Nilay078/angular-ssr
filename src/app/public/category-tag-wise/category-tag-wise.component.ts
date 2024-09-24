import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ListResponse } from 'src/app/common/interfaces/response';
import { Line100PercentBy150Theme, Line100PercentBy250Theme } from 'src/app/constant/skeleton-theme';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { HomeService } from '../home.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { getWindow } from 'ssr-window';
import { ApiUrl, AppUrlConstant, Url } from 'src/app/constant/app-url';
import { CategoryTagWise } from './category-tag-wise-entity';
import { Article } from '../article-view/article';
import { RegistrationComponent } from '../registration/registration.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-category-tag-wise',
    templateUrl: './category-tag-wise.component.html',
    styleUrls: ['./category-tag-wise.component.scss'],
    providers: [HomeService],
})
export class CategoryTagWiseComponent implements OnInit, OnDestroy {
    articleList: any[] = [];
    hasData = false;
    theme = Line100PercentBy150Theme;
    bannerTheme = Line100PercentBy250Theme;
    changeResolutionFlag!: boolean;
    recordSize = 9;
    start = 0;
    blockUI!: boolean;
    totalRecordSize!: number;
    urlType!: string;
    articleBy: any = {};
    title!: string;
    authorView: any;
    stateId!: number;
    appUrl = Url;
    apiUrl = ApiUrl;
    totalCategoryWiseTagList: CategoryTagWise[] = [];
    categoryWiseTagList: CategoryTagWise[] = [];
    moreClicked = 0;
    hasTagFilter!: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private headerActiveService: HeaderActiveService,
        private homeService: HomeService,
        private cookieService: SsrCookieService,
        private snackbarService: SnackBarService,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {
        this.urlType = this.route.snapshot.params['type'];
        const id = _.last(_.split(this.route.snapshot.params['id'], '-'));
        this.articleBy.id = id != undefined ? parseInt(id) : undefined;
        if (Number.isNaN(this.articleBy.id)) {
            this.router.navigate([AppUrlConstant.PAGE_NOT_FOUND]);
        }
        this.headerActiveService.changeActiveClass(false);
        this.hasData = false;
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        getWindow().scroll(0, 0);
        // this.categoryTagWiseSearch();
        this.onSearch(1);
    }

    categoryTagWiseSearch() {
        this.homeService.categoryWiseTagList(this.articleBy.id).then((response: ListResponse) => {
            if (response.hasError) {
                if (response.list) {
                    this.hasTagFilter = false;
                    return;
                }
                this.snackbarService.errorSnackBar(response.message);
                return;
            }
            this.hasTagFilter = true;
            this.categoryWiseTagList = [{ name: 'All', selected: true }];
            this.categoryWiseTagList = this.categoryWiseTagList.concat(response.list as CategoryTagWise[]);
            _.forEach(this.categoryWiseTagList, (tag: CategoryTagWise, index: number) => {
                tag.selected = index === 0;
            });
        });
    }

    onSearch(i: number, tag?: CategoryTagWise) {
        if (i === 2) {
            this.start = 0;
            this.recordSize = 9;
        }
        const data: any = {};
        if (tag) {
            if (tag.id) {
                tag.selected = !tag.selected;
                const clonedList = _.cloneDeep(this.categoryWiseTagList);
                const selectedTagList = _.filter(clonedList, tag => {
                    return tag.selected;
                });
                this.categoryWiseTagList[0].selected = false;
                if (!selectedTagList.length) {
                    this.categoryWiseTagList[0].selected = true;
                }
            } else {
                _.forEach(this.categoryWiseTagList, tag => {
                    tag.selected = false;
                });
                tag.selected = true;
            }
        }
        if (this.urlType === 'tag') {
            data.tagView = this.articleBy;
        }
        if (this.urlType === 'category') {
            data.categoryView = this.articleBy;
        }
        if (this.urlType === 'logical') {
            data.logicalEnumValue = this.articleBy;
        }
        if (this.urlType === 'author') {
            data.authorView = this.articleBy;
        }
        if (this.urlType === 'state') {
            data.stateView = this.articleBy;
        }
        const clonedTagList = _.cloneDeep(this.categoryWiseTagList);
        clonedTagList.splice(0, 1);
        data.tagViews = _.filter(clonedTagList, (tag: CategoryTagWise) => {
            return tag.selected;
        });
        this.hasData = false;
        data.locationView = null;
        this.homeService
            .articleTagCategoryData(data, this.start, this.recordSize)
            .then((response: ListResponse) => {
                if (response.hasError && response.code !== 2001) {
                    this.snackbarService.errorSnackBar(response.message);
                } else {
                    this.articleList = response.list;
                    this.totalRecordSize = response.records;
                    if (this.urlType === 'tag') {
                        this.title = this.articleList[0].tagViews.filter((tag: any) => tag.id === this.articleBy.id)[0].name;
                    }
                    if (this.urlType === 'category') {
                        this.title = this.articleList[0].categoryViews.filter((category: any) => category.id === this.articleBy.id)[0].name;
                    }
                    if (this.urlType === 'logical') {
                        // this.title = this.articleList[0].logicalEnumValue.filter(
                        //     (logical: any) => logical.id === this.articleBy.id
                        // )[0].name;
                        const url: any = this.router.url.split('/');
                        const logicalCategory = url[url.length - 1].split('-');
                        this.title = logicalCategory.slice(0, logicalCategory.length - 1).join(' ');
                    }
                    if (this.urlType === 'author') {
                        const authorData = _.filter(this.articleList[0].authorViews, author => {
                            return author.id === this.articleBy.id;
                        });
                        this.authorView = authorData[0];
                        this.title = authorData[0].displayName;
                    }
                    if (this.urlType === 'state') {
                        this.stateId = this.articleBy.id;
                    }
                }
            })
            .finally(() => {
                this.hasData = true;
            });
    }

    allData() {
        if (this.articleList.length === this.totalRecordSize) {
            this.hasData = true;
            this.blockUI = false;
            return;
        }
        const data: any = {};
        // data.newsType = { key: 1 };
        if (this.urlType === 'tag') {
            data.tagView = this.articleBy;
        }
        if (this.urlType === 'category') {
            data.categoryView = this.articleBy;
        }
        if (this.urlType === 'logical') {
            data.logicalEnumValue = this.articleBy;
        }
        if (this.urlType === 'author') {
            data.authorView = this.articleBy;
        }
        if (this.urlType === 'state') {
            data.stateView = this.articleBy;
        }
        const clonedTagList = _.cloneDeep(this.categoryWiseTagList);
        clonedTagList.splice(0, 1);
        data.tagViews = _.filter(clonedTagList, (tag: CategoryTagWise) => {
            return tag.selected;
        });
        data.locationView = null;
        this.start += this.recordSize;
        this.blockUI = true;
        this.homeService
            .articleTagCategoryData(data, this.start, this.recordSize)
            .then((response: ListResponse) => {
                if (response.hasError && response.code !== 2001) {
                    this.snackbarService.errorSnackBar(response.message);
                } else {
                    _.forEach(response.list, (data: any) => {
                        this.articleList.push(data);
                    });
                }
            })
            .finally(() => {
                this.hasData = true;
                this.blockUI = false;
            });
    }

    onBookmark(article: Article) {
        if (this.cookieService.check('auth-token')) {
            this.homeService.saveBookmark(article.id).then(() => {
                article.bookMark = !article.bookMark;
            });
        } else {
            if (this.changeResolutionFlag) {
                this.router.navigate([Url.LOGIN]);
                getWindow().scroll(0, 0);
            } else {
                this.modalService.open(RegistrationComponent, { backdrop: 'static', size: 'lg', centered: true });
            }
        }
    }

    ngOnDestroy(): void {
        this.headerActiveService.changeOpenHeader(false);
    }
}
