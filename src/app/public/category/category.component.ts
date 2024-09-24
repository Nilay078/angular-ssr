import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { HomeService } from '../home.service';
import { ListResponse, ViewResponse } from 'src/app/common/interfaces/response';
import * as _ from 'lodash';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { RegisterUserService } from 'src/app/shared/components/services/register-user.service';
import { Line100PercentBy35Theme } from 'src/app/constant/skeleton-theme';
import { getWindow } from 'ssr-window';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers: [HomeService],
})
export class CategoryComponent implements OnInit, OnDestroy {
    selectedCategory: any[] = [];
    changeResolutionFlag!: boolean;
    categoryList: any[] = [];
    userView: any;
    clicked = false;
    theme = Line100PercentBy35Theme;
    hasData = false;
    skeletonRange = _.range(6);

    constructor(
        private headerActiveService: HeaderActiveService,
        private router: Router,
        private modalService: NgbModal,
        private homeService: HomeService,
        private snackbarService: SnackBarService,
        private renderer: Renderer2,
        private cookieService: SsrCookieService,
        private registerUserService: RegisterUserService
    ) {}

    ngOnInit(): void {
        this.registerUserService.userView.subscribe((userView: any) => {
            this.userView = userView;
        });
        this.renderer.removeClass(document.body, 'remove-overflow-css');
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        if (!this.changeResolutionFlag && this.router.url === Url.CATEGORY) {
            this.router.navigate([Url.HOME]);
        }
        this.headerActiveService.changeActiveClass(true);
        this.headerActiveService.changeOpenHeader(true);
        this.onSearch();
    }

    onSearch() {
        this.hasData = false;
        this.homeService
            .categorySearch()
            .then((response: ListResponse) => {
                _.forEach(response.list, (category: any) => {
                    if (!category.heroArticle) {
                        category.selected = false;
                        this.categoryList.push(category);
                    }
                });
            })
            .finally(() => {
                this.hasData = true;
            });
    }

    selectionChange(category: any) {
        if (!category.selected) {
            this.selectedCategory.push(category);
        } else {
            const index = this.selectedCategory.indexOf(category);
            this.selectedCategory.splice(index, 1);
        }
        category.selected = !category.selected;
    }

    gotoSubCategory() {
        if (this.selectedCategory.length < 3) {
            this.snackbarService.errorSnackBar('Please select at least 3 categories.');
            return;
        }
        this.userView.categoryViews = this.selectedCategory;
        this.clicked = true;
        this.homeService
            .userSave(this.userView)
            .then((response: ViewResponse) => {
                this.snackbarService.successSnackBar(response.message);
                const userView: any = response.view;
                const expiredDate = new Date();
                expiredDate.setDate(expiredDate.getDate() + 7);
                this.cookieService.set('userId', userView.id, expiredDate);
                this.cookieService.set('userFirstName', userView.firstName, expiredDate);
                this.cookieService.set('userLastName', userView.lastName, expiredDate);
                this.cookieService.set('userMobile', userView.mobile, expiredDate);
                this.cookieService.set('email', userView.email, expiredDate);
                this.cookieService.set('state', JSON.stringify(userView.stateView), expiredDate);
                this.cookieService.set('stateUpdated', JSON.stringify(userView.stateUpdated), expiredDate);

                if (response.accessToken) {
                    this.cookieService.set('auth-token', response.accessToken, expiredDate);
                }
                if (response.refreshToken) {
                    this.cookieService.set('refresh-token', response.refreshToken, expiredDate);
                }
                if (!this.changeResolutionFlag) {
                    this.modalService.dismissAll();
                    this.renderer.addClass(document.body, 'remove-overflow-css');
                }
                if (this.cookieService.check('article-view-url')) {
                    this.router.navigate([Url.ARTICLE_VIEW + '/' + this.cookieService.get('article-view-url')]);
                } else {
                    this.router.navigate([Url.HOME]);
                    setTimeout(() => {
                        getWindow().location.reload();
                    }, 500);
                }
                this.headerActiveService.changeUser(response.view);
            })
            .finally(() => {
                this.clicked = false;
            });
    }

    onClose() {
        this.modalService.dismissAll();
        this.renderer.addClass(document.body, 'remove-overflow-css');
    }

    ngOnDestroy(): void {
        this.headerActiveService.changeOpenHeader(false);
    }
}
