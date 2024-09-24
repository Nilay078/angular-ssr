import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../home.service';
import { Url } from 'src/app/constant/app-url';
import * as _ from 'lodash';
import { ListResponse } from 'src/app/common/interfaces/response';
import { Line100PercentBy250Theme } from 'src/app/constant/skeleton-theme';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleSearchService } from 'src/app/shared/components/services/article-search.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Number } from 'src/app/constant/number';

@Component({
    selector: 'app-article-search',
    templateUrl: './article-search.component.html',
    styleUrls: ['./article-search.component.scss'],
    providers: [HomeService],
})
export class ArticleSearchComponent implements OnInit, OnDestroy {
    @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
    articleSearchForm: FormGroup;
    changeResolutionFlag!: boolean;
    clicked!: boolean;
    appUrl = Url;
    isSearch = false;
    hasData = false;
    hasOptionsData = true;
    hasSearchedData = true;
    articles: any[] = [];
    hasShow = false;
    articleSearchResult = '';
    bannerTheme = Line100PercentBy250Theme;
    articleFilteredOptionsList: any[] = [];
    hasError = false;
    filteredOptions: any[] = [];
    selectedOption!: number;
    start = Number.INITIAL_START_POSITION;
    recordSize = Number.INITIAL_RECORD_SIZE;
    totalRecordSize!: number;
    blockUI = true;

    constructor(
        private fb: FormBuilder,
        private renderer: Renderer2,
        private homeService: HomeService,
        private route: ActivatedRoute,
        private router: Router,
        private articleSearchService: ArticleSearchService,
        private cookieService: SsrCookieService,
        private headerActiveService: HeaderActiveService
    ) {
        this.articleSearchForm = this.fb.group({
            articleSearch: new FormControl(null, [Validators.required]),
        });
        this.articleSearchResult = this.route.snapshot.params['**'];
    }

    ngOnInit(): void {
        this.articleSearchService.filterSearchData.subscribe((searchData: string) => {
            this.articleSearchResult = this.articleSearchResult ?? searchData;
            this.renderer.removeClass(document.body, 'remove-overflow-css');
            const isMobile: string = this.cookieService.get('isMobile');
            this.changeResolutionFlag = isMobile === 'true';
            this.headerActiveService.changeActiveSearchBar(true);
            if (!this.articleSearchResult) {
                this.hasSearchedData = false;
                this.headerActiveService.showHideFooter(true);
                if (!this.changeResolutionFlag) {
                    this.router.navigate([this.appUrl.HOME]);
                }
            } else {
                this.articleSearchResult
                    .split('-')
                    .filter(function (item) {
                        item = item ? item.replace(/-/g, '') : item;
                        return item;
                    })
                    .join(' ');
                this.articleSearchResult = this.cookieService.get('searchSlug');
                this.articleSearchForm.controls['articleSearch'].setValue(this.articleSearchResult);
                this.reset();
                this.selectedOption = 1;
                this.onArticleSearchResult();
                this.hasSearchedData = true;
                this.headerActiveService.showHideFooter(false);
            }
            this.onSearchFilterOptions();
        });
    }

    onArticleSearchResult() {
        this.hasError = false;
        const data: any = {};
        data.type = { key: this.selectedOption };
        data.text = this.articleSearchResult;
        this.homeService
            .searchArticleResults(data, this.start, this.recordSize)
            .then((response: ListResponse) => {
                this.articles = this.articles.concat(response.list);
                this.totalRecordSize = response.records;
                if (this.articles.length === 0) {
                    this.hasError = true;
                }
            })
            .finally(() => {
                this.blockUI = false;
                this.hasData = true;
            });
    }

    onScroll() {
        if (this.articles.length < this.totalRecordSize) {
            this.blockUI = true;
            this.start += this.recordSize;
            this.onArticleSearchResult();
        }
    }

    onSearchFilterOptions() {
        this.hasOptionsData = false;
        this.articleFilteredOptionsList = [];
        this.homeService
            .searchArticleFilterOptions()
            .then((response: ListResponse) => {
                _.forEach(response.list, (data: any) => {
                    data.selected = false;
                    this.articleFilteredOptionsList.push(data);
                });
                this.articleFilteredOptionsList[0].selected = true;
            })
            .finally(() => {
                this.hasOptionsData = true;
            });
    }

    onChangeFilter(selectedFilter: any) {
        _.forEach(this.articleFilteredOptionsList, (filter: any) => {
            filter.selected = false;
        });
        selectedFilter.selected = true;
    }

    onSubmit() {
        this.isSearch = true;
        this.articleSearchForm.controls['articleSearch'].setValue(this.articleSearchForm.controls['articleSearch'].value);
    }

    openSearch() {
        if (this.articleSearchForm.controls['articleSearch'].value) {
            this.isSearch = false;
            const slugUrl = this.articleSearchForm.controls['articleSearch'].value
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            this.router.navigate([this.appUrl.ARTICLE_SEARCH + '/' + slugUrl]);
            this.articleSearchResult = this.articleSearchForm.controls['articleSearch'].value;
            this.cookieService.delete('searchSlug');
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + 7);
            this.cookieService.set('searchSlug', this.articleSearchForm.controls['articleSearch'].value, expiredDate);
            this.articleSearchService.changeSearch(this.articleSearchForm.controls['articleSearch'].value);
            this.articleSearchForm.controls['articleSearch'].setValue(this.articleSearchResult);
        }
    }

    onSelectClick(event: any) {
        this.selectedOption = event.index + 1;
        this.reset();
        this.onArticleSearchResult();
    }

    private reset() {
        this.articles = [];
        this.start = 0;
        this.recordSize = 15;
        this.hasData = false;
    }

    ngOnDestroy(): void {
        this.headerActiveService.changeActiveSearchBar(false);
        this.articleSearchForm.reset();
    }
}
