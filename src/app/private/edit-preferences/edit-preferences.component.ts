import { ListResponse, ViewResponse } from './../../common/interfaces/response';
import { HomeService } from './../../public/home.service';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { KeyValue } from 'src/app/common/interfaces/entities/entity';

@Component({
    selector: 'app-edit-preferences',
    templateUrl: './edit-preferences.component.html',
    styleUrls: ['./edit-preferences.component.scss'],
    providers: [HomeService],
})
export class EditPreferencesComponent implements OnInit, OnDestroy {
    changeResolutionFlag!: boolean;
    selectedCategory: any[] = [];
    categoryList: any[] = [];
    breadcrumbs: KeyValue[] = [];
    userView: any;

    constructor(
        private headerActiveService: HeaderActiveService,
        private homeService: HomeService,
        private router: Router,
        private snackbarService: SnackBarService,
        private cookieService: SsrCookieService
    ) {
        this.breadcrumbs = [
            { key: 'Home', value: Url.HOME },
            { key: 'Edit Preferences', value: '' },
        ];
    }

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('previousUrl', Url.MY_ACCOUNT);
        this.onSearch();
    }

    onSearch() {
        const userId: any = this.cookieService.get('userId');
        this.homeService.userView(userId).then((response: ViewResponse) => {
            this.userView = response.view;
            this.selectedCategory = this.userView.categoryViews;
            this.homeService.categorySearch().then((response: ListResponse) => {
                _.forEach(response.list, (category: any) => {
                    category.selected = false;
                    if (!category.heroArticle) {
                        category.selected = false;
                        this.categoryList.push(category);
                    }
                    _.forEach(this.selectedCategory, (userCategory: any) => {
                        if (category.id === userCategory.id) {
                            category.selected = true;
                        }
                    });
                });
            });
        });
    }

    selectionChange(category: any) {
        if (!category.selected) {
            this.selectedCategory.push(category);
        } else {
            _.remove(this.selectedCategory, (selectCategory: any) => {
                return selectCategory.id === category.id;
            });
        }
        category.selected = !category.selected;
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.MY_ACCOUNT]);
    }

    onUpdate() {
        if (this.selectedCategory.length < 3) {
            this.snackbarService.errorSnackBar('Please select at least 3 categories.');
            return;
        }
        let data: any = {};
        data = this.userView;
        data.categoryViews = this.selectedCategory;
        this.homeService.categoryUpdate(data).then((response: ViewResponse) => {
            this.snackbarService.successSnackBar(response.message);
        });
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
    }
}
