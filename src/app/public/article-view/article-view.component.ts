import { Line100PercentBy400Theme } from 'src/app/constant/skeleton-theme';
import {
    AfterViewChecked,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    Inject,
    PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { ApiUrl, AppUrlConstant, Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { HomeService } from '../home.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { Clipboard } from '@angular/cdk/clipboard';
import * as _ from 'lodash';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { getWindow } from 'ssr-window';
import { ErrorMessage } from 'src/app/constant/error-message';
import { AuthorService } from 'src/app/shared/components/services/author.service';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/app/shared/enums/article-type-enum';
import { NewsType } from 'src/app/shared/enums/news-type-enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from '../registration/registration.component';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SocialSharePlatform, socialSharePlatforms } from 'src/app/shared/components/article-share/social-share-platform';

@Component({
    selector: 'app-article-view',
    templateUrl: './article-view.component.html',
    styleUrls: ['./article-view.component.scss'],
    providers: [HomeService],
})
export class ArticleViewComponent implements OnInit, AfterViewChecked, OnDestroy {
    @ViewChild('para', { static: true }) para!: ElementRef;
    articleId!: any;
    articleView!: any;
    apiUrl = ApiUrl;
    appUrl = Url;
    hasData = false;
    isSkimMode = false;
    isAccordionList = false;
    theme = Line100PercentBy400Theme;
    changeResolutionFlag!: boolean;
    slugName!: string;
    topPosToStartShowing = 100;
    isShow!: boolean;
    fontSizeFlag = false;
    categoryList: any[] = [];
    hasError = false;
    articleType = ArticleType;
    newsType = NewsType;
    userView: any;
    isSubscribed = true;
    isBrowser = false;
    articleViewUrl = `${environment.website}/${AppUrlConstant.ARTICLE_VIEW}/`;
    socialSharePlatforms: SocialSharePlatform[] = socialSharePlatforms;

    constructor(
        private router: Router,
        private headerActiveService: HeaderActiveService,
        private route: ActivatedRoute,
        private homeService: HomeService,
        private el: ElementRef,
        private clipboard: Clipboard,
        private snackbarService: SnackBarService,
        private sanitizer: DomSanitizer,
        public cookieService: SsrCookieService,
        public authorService: AuthorService,
        private renderer: Renderer2,
        private modalService: NgbModal,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) platformId: object
    ) {
        this.articleId = this.route.snapshot.params['id'];
        this.slugName = this.articleId;
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngAfterViewChecked() {
        Array.from(this.el.nativeElement.querySelectorAll('.article-detail-txt-box a')).forEach((el: any) => {
            el.setAttribute('target', '_blank');
        });
    }

    ngOnInit() {
        this.headerActiveService.changeActiveHeader(false);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.headerActiveService.changeActiveClass(true);
        this.headerActiveService.changeOpenHeader(true);
        this.headerActiveService.showHideFooter(false);
        this.renderer.addClass(this.document.body, 'deep-dive-access-denied');
        this.cookieService.delete('article-view-url');
        this.onArticleView();
    }

    onArticleView() {
        this.hasData = false;
        this.categoryList = [];
        this.homeService
            .articleView(this.slugName)
            .then((response: ViewResponse) => {
                if (response.hasError) {
                    if (response.code === 2001) {
                        this.router.navigate([AppUrlConstant.PAGE_NOT_FOUND]);
                    } else {
                        this.snackbarService.errorSnackBar(response.message);
                    }
                    return;
                }
                this.articleView = response.view;
                _.forEach(this.articleView.categoryViews, (category: any) => {
                    if (!category.heroArticle) {
                        this.categoryList.push(category);
                    }
                });
                _.forEach(this.articleView.contentDetailsViews, (article: any) => {
                    if (article.type.key === 4) {
                        article.embeddedCode = this.sanitizer.bypassSecurityTrustHtml(article.embeddedCode);
                    }
                    if (article.type.key === 1) {
                        article.text = this.sanitizer.bypassSecurityTrustHtml(article.text);
                    }
                });
                if (this.cookieService.check('userId')) {
                    const userId: any = this.cookieService.get('userId');
                    this.homeService.userView(userId).then((response: ViewResponse) => {
                        this.userView = response.view;
                        if (this.userView.subscribe) {
                            this.isSubscribed = true;
                            this.renderer.removeClass(this.document.body, 'deep-dive-access-denied');
                        } else if (this.articleView.newsType.key === this.newsType.DEEP_DIVE) {
                            this.renderer.addClass(this.document.body, 'deep-dive-access-denied');
                            this.isSubscribed = false;
                        } else {
                            this.renderer.removeClass(this.document.body, 'deep-dive-access-denied');
                        }
                    });
                } else if (this.articleView.newsType.key === this.newsType.DEEP_DIVE) {
                    this.renderer.addClass(this.document.body, 'deep-dive-access-denied');
                    this.isSubscribed = false;
                } else {
                    this.renderer.removeClass(this.document.body, 'deep-dive-access-denied');
                }
            })
            .finally(() => {
                this.hasData = true;
            });
    }

    backPage() {
        this.router.navigate([Url.HOME]);
    }

    shortArticleList = [
        {
            id: 1,
            title: 'Moving up the value chain',
            description:
                'Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new.',
        },
        {
            id: 2,
            title: 'What changed for Cashify?',
            description:
                'Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new.',
        },
        {
            id: 3,
            title: 'Buying to sell',
            description:
                'Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new.',
        },
        {
            id: 4,
            title: 'David versus Goliath',
            description:
                'Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new. Tonnes per annum of green supply chain issues it caused led to a shortage of new.',
        },
    ];

    clickArticle(index: number) {
        const skimDiv = document.getElementById('article' + index);
        if (skimDiv?.classList.contains('show-article-class')) {
            skimDiv?.classList.remove('show-article-class');
            this.isAccordionList = false;
        } else {
            Array.from(document.querySelectorAll('.show-article-class')).forEach(el => el.classList.remove('show-article-class'));
            skimDiv?.classList.add('show-article-class');
            this.isAccordionList = true;
        }
    }

    selectionChange(tagData: any) {
        this.router.navigate([this.authorService.generateSlug(tagData.name, tagData.id, this.articleType.TAG)]);
    }

    copyLink(article: any) {
        this.clipboard.copy(`${this.articleViewUrl}${article.slug}`);
        this.snackbarService.successSnackBar(ErrorMessage.LINK_COPIED);
    }

    gotoHome() {
        this.router.navigate([Url.HOME]);
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

    goToHome() {
        this.router.navigate([Url.HOME]);
    }

    onBookmark(articleId: number) {
        if (this.cookieService.check('auth-token')) {
            this.homeService.saveBookmark(articleId).then(() => {
                this.onArticleView();
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

    subscribeNow() {
        this.router.navigate([Url.EXCLUSIVE_LOGIN]);
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 90);
        this.cookieService.set('article-view-url', this.slugName, expiredDate);
    }

    ngOnDestroy(): void {
        this.headerActiveService.changeOpenHeader(false);
        this.renderer.removeClass(this.document.body, 'deep-dive-access-denied');
    }
}
