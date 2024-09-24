import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Url, ApiUrl, AppUrlConstant } from 'src/app/constant/app-url';
import { ErrorMessage } from 'src/app/constant/error-message';
import { AuthorService } from 'src/app/shared/components/services/author.service';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { getWindow } from 'ssr-window';
import { SwiperOptions } from 'swiper';
import { HomeService } from '../../home.service';
import { RegistrationComponent } from '../../registration/registration.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { ArticleType } from 'src/app/shared/enums/article-type-enum';
import { Line100PercentBy150Theme, Line100PercentBy400Theme } from 'src/app/constant/skeleton-theme';

@Component({
    selector: 'app-slider-state-selection',
    templateUrl: './slider-state-selection.component.html',
    styleUrls: ['./slider-state-selection.component.scss'],
})
export class SliderStateSelectionComponent implements OnInit, AfterViewInit {
    @Input() data!: any;
    @Input() removeBorder!: boolean;
    @Output() changeBookmark = new EventEmitter();
    appUrl = Url;
    apiUrl = ApiUrl;
    changeResolutionFlag!: boolean;
    hasData!: boolean;
    articleType = ArticleType;
    theme = Line100PercentBy400Theme;
    thumbnailTheme = Line100PercentBy150Theme;

    config: SwiperOptions = {
        freeMode: true,
        slidesPerView: 1.4,
        spaceBetween: 20,
        // 'autoplay': {
        //   delay: 2000
        // }
        breakpoints: {
            575: { slidesPerView: 1.8 },
        },
    };

    desktopConfig: SwiperOptions = {
        freeMode: true,
        slidesPerView: 2.4,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            992: { slidesPerView: 3.4 },
        },
    };

    constructor(
        private router: Router,
        private snackbarService: SnackBarService,
        private clipboard: Clipboard,
        private homeService: HomeService,
        private cookieService: SsrCookieService,
        public authorService: AuthorService,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.hasData = false;
    }

    ngAfterViewInit(): void {
        this.hasData = true;
    }

    onViewAll(sectionData: any) {
        this.router.navigate([this.authorService.generateSlug(sectionData.name, sectionData.referenceId, sectionData.articleType.key)]);
    }

    socialMediaShare(article: any, index: number) {
        const baseUrl = environment.website + AppUrlConstant.ARTICLE_VIEW + '/' + article.slug;
        if (index === 1) {
            getWindow().open(`https://twitter.com/intent/tweet?url=${baseUrl}`, '_blank');
        }
        if (index === 2) {
            getWindow().open(`https://www.facebook.com/sharer/sharer.php?u=${baseUrl}`, '_blank');
        }
        if (index === 3) {
            getWindow().open(`https://www.linkedin.com/sharing/share-offsite/?url=${baseUrl}`, '_blank');
        }
        if (index === 4) {
            getWindow().open(`https://wa.me?text=${baseUrl}`, '_blank');
        }
    }

    copyLink(article: any) {
        const baseUrl = environment.website + AppUrlConstant.ARTICLE_VIEW + '/' + article.slug;
        this.clipboard.copy(baseUrl);
        this.snackbarService.successSnackBar(ErrorMessage.LINK_COPIED);
    }

    onBookmark(articleId: number) {
        if (this.cookieService.check('auth-token')) {
            this.homeService.saveBookmark(articleId).then(() => {
                this.changeBookmark.emit();
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
}
