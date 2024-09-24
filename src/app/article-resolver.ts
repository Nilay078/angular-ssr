/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from './services/http.service';
import { SEOService } from './seo.service';
import { ApiUrl } from './constant/app-url';
import { ViewResponse } from './common/interfaces/response';
import { Article } from './public/article-view/article';

@Injectable({
    providedIn: 'root',
})
export class ArticleResolver implements Resolve<any> {
    apiUrl = ApiUrl;
    constructor(private httpService: HttpService, private seoService: SEOService) {}

    async resolve(route: ActivatedRouteSnapshot) {
        const id: any = route.params['id'];
        let data: any;
        if (!id) {
            let data!: Article;
            data.metaTitle = 'Patnaik, Pandian, And The Intriguing Story Of Odisha Politics';
            data.metaDescription =
                'Odisha CM Naveen Patnaik’s private secretary Pandian, a non-Odia, brazens out criticism and scrutiny over his supposedly powerful influence in the state - with the blessings of his';
            data.bannerFileView.fileId = '5dadcc91481a49259223c1e9d8f53292';
            return;
        }
        await this.httpService.get<ViewResponse>(this.apiUrl.ARTICLE_META_INFO + id).then((response: ViewResponse) => {
            data = response.view;
            this.seoService.setArticleMetaData(data);
        });
        return data;
    }
}
