import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { CategoryComponent } from '../category/category.component';
import { HomeService } from '../home.service';
import { ViewResponse } from 'src/app/common/interfaces/response';
import * as _ from 'lodash';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
    selector: 'app-sub-category',
    templateUrl: './sub-category.component.html',
    styleUrls: ['./sub-category.component.scss'],
    providers: [HomeService],
})
export class SubCategoryComponent implements OnInit, OnDestroy {
    changeResolutionFlag!: boolean;
    categoryList: any[] = [];
    selectedCategoryList: any[] = [];
    finalCategoryList: any[] = [];
    selectedSubCategory: any[] = [];
    userView: any;

    constructor(
        private headerActiveService: HeaderActiveService,
        private router: Router,
        private cookieService: SsrCookieService,
        private modalService: NgbModal,
        private homeService: HomeService,
        private snackbarService: SnackBarService
    ) {}

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.headerActiveService.changeActiveClass(true);
        this.headerActiveService.changeOpenHeader(true);
        this.onSearch();
    }

    onSearch() {
        _.forEach(this.categoryList, (category: any) => {
            if (category.subCategories) {
                _.forEach(category.subCategories, (subCategory: any) => {
                    subCategory.selected = false;
                });
                this.selectedCategoryList.push(category);
            } else {
                this.finalCategoryList.push(category);
            }
        });
    }

    onSelectSubCategory(category: any) {
        if (!category.selected) {
            this.selectedSubCategory.push(category);
        } else {
            const index = this.selectedSubCategory.indexOf(category);
            this.selectedSubCategory.splice(index, 1);
        }
        category.selected = !category.selected;
    }

    backPage() {
        if (this.changeResolutionFlag) {
            this.router.navigate([Url.CATEGORY]);
        } else {
            this.modalService.dismissAll();
            this.modalService.open(CategoryComponent, { backdrop: 'static', size: 'lg', centered: true });
        }
    }

    onContinue() {
        _.forEach(this.selectedCategoryList, (category: any) => {
            let flag = false;
            _.forEach(category.subCategories, (subCategory: any) => {
                if (subCategory.selected) {
                    flag = true;
                }
            });
            if (!flag) {
                this.snackbarService.errorSnackBar('Please select at least one subcategory from each category.');
                return;
            } else {
                return true;
            }
        });
        _.forEach(this.selectedSubCategory, (category: any) => {
            this.finalCategoryList.push(category);
        });
        this.userView.categoryViews = this.finalCategoryList;
        this.homeService.userUpdate(this.userView).then((response: ViewResponse) => {
            this.snackbarService.successSnackBar(response.message);
            if (this.changeResolutionFlag) {
                this.router.navigate([Url.HOME]);
            } else {
                this.modalService.dismissAll();
            }
        });
    }

    onClose() {
        this.modalService.dismissAll();
    }

    ngOnDestroy(): void {
        this.headerActiveService.changeOpenHeader(false);
    }
}
