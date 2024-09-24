import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HomeService } from '../home.service';
import { getWindow } from 'ssr-window';
import { StaticArticleService } from 'src/app/shared/components/services/static-article.service';
import { ApiUrl, AppUrlConstant } from 'src/app/constant/app-url';
import { Router } from '@angular/router';
import { SEOService } from 'src/app/seo.service';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Article } from '../article-view/article';

@Component({
    selector: 'app-static-article',
    templateUrl: './static-article.component.html',
    styleUrls: ['./static-article.component.scss'],
    providers: [HomeService],
})
export class StaticArticleComponent {
    @ViewChild('para', { static: true }) para!: ElementRef;
    articleView!: any;
    topPosToStartShowing = 100;
    isShow!: boolean;
    fontSizeFlag = false;
    apiUrl = ApiUrl;
    currentDate = Date.now();
    social_media_url = AppUrlConstant;
    changeResolutionFlag!: boolean;

    constructor(
        private staticArticleService: StaticArticleService,
        private router: Router,
        private seoService: SEOService,
        private headerActiveService: HeaderActiveService,
        private cookieService: SsrCookieService
    ) {
        this.articleView = this.staticArticleService.staticArticleData();
        let data!: Article;
        data.title = this.articleView.title;
        data.subHeading = this.articleView.subHeading;
        data.bannerFileView.fileId = this.articleView.bannerFileView.fileId;
        this.seoService.setArticleMetaData(data);
        this.headerActiveService.changeActiveHeader(false);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
    }

    @HostListener('window:scroll')
    checkScroll() {
        const scrollPosition = getWindow().pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= this.topPosToStartShowing) {
            this.isShow = true;
        } else {
            this.isShow = false;
        }
    }

    gotoTop() {
        getWindow().scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }

    changeFontSize() {
        this.fontSizeFlag = !this.fontSizeFlag;
    }

    openRegister() {
        this.router.navigate(['/']);
    }
}
