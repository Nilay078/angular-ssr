import { HomeService } from './../home.service';
import { SnackBarService } from './../../shared/components/services/snackbar.service';
import { AppUrlConstant } from './../../constant/app-url';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { RegistrationComponent } from '../registration/registration.component';
import { ListResponse } from 'src/app/common/interfaces/response';
import * as _ from 'lodash';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { AuthorService } from 'src/app/shared/components/services/author.service';
import { ArticleType } from 'src/app/shared/enums/article-type-enum';
import { getWindow } from 'ssr-window';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { Category } from 'src/app/common/interfaces/entities/entity';
import Utils from 'src/app/utility/utils';

@Component({
    selector: 'app-more-menu',
    templateUrl: './more-menu.component.html',
    styleUrls: ['./more-menu.component.scss'],
    providers: [HomeService],
})
export class MoreMenuComponent implements OnInit {
    appUrl = Url;
    changeResolutionFlag!: boolean;
    userView: any;
    categoryList: any[] = [];
    currentDate = Date.now();
    social_media_url = AppUrlConstant;
    articleType = ArticleType;
    favCatgories: Category[] = [];
    hasData = false;
    name: string | undefined;

    constructor(
        private modalService: NgbModal,
        public jwtHelper: JwtHelperService,
        private router: Router,
        private snackbarService: SnackBarService,
        private homeService: HomeService,
        private cookieService: SsrCookieService,
        public authorService: AuthorService,
        private ngNavigatorShareService: NgNavigatorShareService
    ) {}

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        if (!this.changeResolutionFlag && this.router.url === '/' + Url.MORE) {
            this.router.navigate([this.appUrl.HOME]);
        }
        this.onSearch();
    }

    onSearch() {
        this.homeService.categorySearch().then((response: ListResponse) => {
            _.forEach(response.list, (category: any) => {
                if (!category.heroArticle) {
                    this.categoryList.push(category);
                }
            });
            const favCategory: Category[] = _.filter(this.categoryList, (category: Category) => category.favorite);
            this.favCatgories = _.map(favCategory, (category: Category) => {
                return {
                    ...category,
                    slug: Utils.convertToSlug(category.name),
                };
            });
            this.hasData = true;
            if (this.cookieService.check('userId')) {
                this.name = `${this.cookieService.get('userFirstName')} ${this.cookieService.get('userLastName')}`;
            }
        });
    }

    onClose() {
        this.modalService.dismissAll();
    }

    onCloseMenu() {
        this.router.navigate([this.appUrl.HOME]);
    }

    onLogout() {
        if (this.jwtHelper.isTokenExpired(this.cookieService.get('auth-token') as string)) {
            this.router.navigate([this.appUrl.HOME]);
            this.cookieService.deleteAll();
            this.snackbarService.successSnackBar('You have successfully logged out.');
            this.modalService.dismissAll();
        } else {
            this.modalService.dismissAll();
            this.homeService.logout().then(response => {
                this.deleteAllCookie();
                this.router.navigate([this.appUrl.HOME]);
                setTimeout(() => {
                    getWindow().location.reload();
                }, 500);
                this.snackbarService.successSnackBar(response.message);
            });
        }
    }

    deleteAllCookie() {
        this.cookieService.deleteAll();
        this.cookieService.deleteAll('/');
        this.cookieService.deleteAll('/article');
        this.cookieService.deleteAll('/article/category');
        this.cookieService.deleteAll('/article/tag');
        this.cookieService.deleteAll('/article/author');
        this.cookieService.deleteAll('/article/state');
    }

    openRegister() {
        this.modalService.dismissAll();
        this.modalService.open(RegistrationComponent, { backdrop: 'static', size: 'lg', centered: true });
    }

    onShareApp() {
        if (this.ngNavigatorShareService.canShare()) {
            this.ngNavigatorShareService.share({
                title: 'The Secretariat News',
                text: 'To stay up to date with policy news and insightful analyses, download The Secretariat app using the following link. \n\nAndroid App:\nhttps://play.google.com/store/apps/details?id=in.the.secretariat.news&hl=en-IN, \n\niOS App:\nhttps://apps.apple.com/us/app/the-secretariat-news/id6447047233',
            });
        } else {
            this.snackbarService.errorSnackBar('This service/api is not supported in your Browser');
        }
    }

    openHome() {
        this.router.navigate([Url.HOME]);
    }
}
