import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { HomeService } from '../home.service';
import { ListResponse, ViewResponse } from 'src/app/common/interfaces/response';
import { Line100PercentBy150Theme, Line100PercentBy400Theme } from 'src/app/constant/skeleton-theme';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { DesktopSectionType, MobileSectionType } from 'src/app/shared/enums/section-type-enum';
import { IdName, KeyValue } from 'src/app/common/interfaces/entities/entity';
import * as _ from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import Utils from 'src/app/utility/utils';
import { PrivateService } from 'src/app/private/private.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-page-configuration',
    templateUrl: './page-configuration.component.html',
    styleUrls: ['./page-configuration.component.scss'],
    providers: [HomeService],
})
export class PageConfigurationComponent implements OnInit {
    articleList: any[] = [];
    hasData = false;
    theme = Line100PercentBy400Theme;
    thumbnailTheme = Line100PercentBy150Theme;
    changeResolutionFlag!: boolean;
    userView: any;
    viewType!: number;
    locationView: any;
    currentDate = Date.now();
    pageSlug!: string;
    appUrl = Url;
    desktopSectionType = DesktopSectionType;
    mobileSectionType = MobileSectionType;
    staticPageView!: any;
    breadcrumbs: KeyValue[] = [];
    stateList: IdName[] = [];
    filteredStateList: IdName[] = [];
    stateForm!: FormGroup;
    hasStateData = false;
    utils = Utils;
    isBrowser = false;

    constructor(
        private headerActiveService: HeaderActiveService,
        private homeService: HomeService,
        public cookieService: SsrCookieService,
        private snackbarService: SnackBarService,
        private route: ActivatedRoute,
        public router: Router,
        private fb: FormBuilder,
        private privateService: PrivateService,
        @Inject(PLATFORM_ID) platformId: object
    ) {
        this.pageSlug = this.route.snapshot.params['slug'];
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(false);
        this.headerActiveService.changeActiveHeader(false);
        this.hasData = false;
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.headerActiveService.userView.subscribe((user: any) => {
            this.userView = user;
        });
        if (this.cookieService.check('userFirstName')) {
            const user: any = {};
            user.firstName = this.cookieService.get('userFirstName');
            user.lastName = this.cookieService.get('userLastName');
            const userData: any = this.cookieService.get('userId');
            this.homeService.userView(userData).then((response: ViewResponse) => {
                this.userView = response.view;
                this.onSearch();
            });
        } else {
            this.onSearch();
        }
    }

    stateSearch() {
        this.hasStateData = false;
        this.homeService
            .stateListSearch()
            .then((stateResponse: ListResponse) => {
                this.stateList = stateResponse.list as IdName[];
                this.filteredStateList = _.cloneDeep(this.stateList);
            })
            .finally(() => {
                this.hasStateData = true;
            });
    }

    onSearch() {
        this.stateSearch();
        this.homeService
            .articleData(this.pageSlug)
            .then((response: ListResponse) => {
                if (response.hasError && response.code !== 2001) {
                    this.snackbarService.errorSnackBar(response.message);
                } else {
                    if (response.view) {
                        this.staticPageView = response.view;
                        this.breadcrumbs = [
                            { key: 'Home', value: Url.HOME },
                            { key: this.staticPageView.name, value: '' },
                        ];
                    }
                    if (response.list) {
                        this.articleList = response.list;
                        _.filter(this.articleList, (article: any) => {
                            if (
                                (article.mobileArticleLayout?.key === this.mobileSectionType.SLIDER ||
                                    article.desktopArticleLayout?.key === this.desktopSectionType.SLIDER) &&
                                article.articleType &&
                                article.articleType.key === 3
                            ) {
                                article.stateView = _.find(this.stateList, (state: IdName) => state.id === article.referenceId);
                                this.stateForm = this.fb.group({
                                    name: article.stateView ?? null,
                                });
                            }
                        });
                    }
                }
            })
            .finally(() => {
                this.hasData = true;
            });
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.HOME]);
    }

    onStateChange(event: any, index: number) {
        this.hasData = false;
        const stateData = _.cloneDeep(this.articleList[index]);
        stateData.referenceId = event.value.id;
        this.privateService
            .articleByState(stateData)
            .then((response: ViewResponse) => {
                this.articleList[index] = response.view;
                this.articleList[index].stateView = _.find(
                    this.stateList,
                    (state: any) => state.id === this.articleList[index].referenceId
                );
            })
            .finally(() => {
                this.hasData = true;
            });
    }
}
