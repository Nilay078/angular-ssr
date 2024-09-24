import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ApiUrl, Url } from 'src/app/constant/app-url';
import { HomeService } from '../../home.service';
import { Router } from '@angular/router';
import { getWindow } from 'ssr-window';
import { RegistrationComponent } from '../../registration/registration.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorService } from 'src/app/shared/components/services/author.service';
import { ArticleType } from 'src/app/shared/enums/article-type-enum';
import { ListResponse, ViewResponse } from 'src/app/common/interfaces/response';
import { IdName } from 'src/app/common/interfaces/entities/entity';
import * as _ from 'lodash';
import Utils from 'src/app/utility/utils';
import { PrivateService } from 'src/app/private/private.service';
import { Line100PercentBy150Theme, Line100PercentBy400Theme } from 'src/app/constant/skeleton-theme';

@Component({
    selector: 'app-hero-banner-with-thumbnail',
    templateUrl: './hero-banner-with-thumbnail.component.html',
    styleUrls: ['./hero-banner-with-thumbnail.component.scss'],
    providers: [HomeService],
})
export class HeroBannerWithThumbnailComponent implements OnInit {
    @Input() removeBorder!: boolean;
    @Input() data: any;
    @Output() changeBookmark = new EventEmitter();
    apiUrl = ApiUrl;
    appUrl = Url;
    articleType = ArticleType;

    changeResolutionFlag!: boolean;
    stateList: IdName[] = [];
    filteredStateList: IdName[] = [];
    utils = Utils;
    hasData = true;
    theme = Line100PercentBy400Theme;
    thumbnailTheme = Line100PercentBy150Theme;

    constructor(
        private cookieService: SsrCookieService,
        private homeService: HomeService,
        private router: Router,
        private modalService: NgbModal,
        public authorService: AuthorService,
        private privateService: PrivateService
    ) {}

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        if (this.data.articleType && this.data.articleType.key === 3) {
            this.stateSearch();
        }
    }

    stateSearch() {
        this.homeService.stateListSearch().then((response: ListResponse) => {
            this.stateList = response.list as IdName[];
            this.filteredStateList = _.cloneDeep(this.stateList);
            this.data.stateView = _.find(this.stateList, (state: any) => state.id === this.data.referenceId);
        });
    }

    onViewAll(sectionData: any) {
        this.router.navigate([this.authorService.generateSlug(sectionData.name, sectionData.referenceId, sectionData.articleType.key)]);
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

    onStateChange(event: any) {
        this.hasData = false;
        const stateData = _.cloneDeep(this.data);
        stateData.referenceId = event.value.id;
        this.privateService
            .articleByState(stateData)
            .then((response: ViewResponse) => {
                this.data = response.view;
                this.data.stateView = _.find(this.stateList, (state: any) => state.id === this.data.referenceId);
            })
            .finally(() => {
                this.hasData = true;
            });
    }
}
