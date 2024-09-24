import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HomeService } from '../../home.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ApiUrl, Url } from 'src/app/constant/app-url';
import { AuthorService } from 'src/app/shared/components/services/author.service';
import { getWindow } from 'ssr-window';
import { RegistrationComponent } from '../../registration/registration.component';
import { ArticleType } from 'src/app/shared/enums/article-type-enum';
import { Article } from '../../article-view/article';
import { ListResponse, ViewResponse } from 'src/app/common/interfaces/response';
import { IdName } from 'src/app/common/interfaces/entities/entity';
import * as _ from 'lodash';
import Utils from 'src/app/utility/utils';
import { PrivateService } from 'src/app/private/private.service';
import { Line100PercentBy150Theme, Line100PercentBy400Theme } from 'src/app/constant/skeleton-theme';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
    providers: [HomeService],
})
export class BannerComponent implements OnInit {
    @Input() data!: any;
    @Input() articleType!: any;
    @Input() typeName!: any;
    @Input() blockUI!: boolean;
    @Input() hide!: boolean;
    @Input() authorView!: any;
    @Input() stateId!: number;
    @Input() removeBorder!: boolean;
    @Output() allData = new EventEmitter();
    @Output() changeBookmark = new EventEmitter();

    articleTypeEnum = ArticleType;
    apiUrl = ApiUrl;
    appUrl = Url;
    changeResolutionFlag!: boolean;
    isReadMore = false;
    stateList: IdName[] = [];
    filteredStateList: IdName[] = [];
    utils = Utils;
    hasData = true;
    theme = Line100PercentBy400Theme;
    thumbnailTheme = Line100PercentBy150Theme;
    stateView: any;

    constructor(
        private router: Router,
        private homeService: HomeService,
        private cookieService: SsrCookieService,
        public authorService: AuthorService,
        private modalService: NgbModal,
        private privateService: PrivateService
    ) {}

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        if ((this.data.articleType && this.data.articleType.key === 3) || this.stateId) {
            this.stateSearch();
        }
    }

    stateSearch() {
        this.homeService.stateListSearch().then((response: ListResponse) => {
            this.stateList = response.list as IdName[];
            this.filteredStateList = _.cloneDeep(this.stateList);
            this.data.stateView = _.find(this.stateList, (state: any) => state.id === this.data.referenceId);
            this.stateView = _.find(this.stateList, (state: any) => state.id === this.stateId);
        });
    }

    onScroll() {
        this.allData.emit();
    }

    onViewAll(sectionData: any) {
        this.router.navigate([this.authorService.generateSlug(sectionData.name, sectionData.referenceId, sectionData.articleType.key)]);
    }

    onBookmark(article: Article) {
        if (this.cookieService.check('auth-token')) {
            this.homeService.saveBookmark(article.id).then(() => {
                article.bookMark = !article.bookMark;
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
        if (!this.articleType) {
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
        } else {
            this.router.navigate([this.authorService.generateSlug(this.stateView.name, this.stateView.id, this.articleTypeEnum.STATE)]);
        }
    }
}
