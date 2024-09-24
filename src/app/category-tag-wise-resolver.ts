/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SEOService } from './seo.service';
import { ApiUrl } from './constant/app-url';

@Injectable({
    providedIn: 'root',
})
export class CategoryTagWiseResolver implements Resolve<any> {
    apiUrl = ApiUrl;
    constructor(private seoService: SEOService) {}

    async resolve(route: ActivatedRouteSnapshot) {
        const urlType: string = route.params['type'];
        const pageSlug: string[] = route.params['id'].split('-');
        const metaData: any = {};
        metaData.url = 'article/' + urlType + '/' + route.params['id'];
        pageSlug.splice(pageSlug.length - 1, 1);
        const categoryName: string = pageSlug.join('-');
        if (urlType === 'category') {
            switch (categoryName) {
                case 'policy-plunge':
                    metaData.metaTitle = 'Policy Plunge | The Secretariat News';
                    metaData.metaDescription =
                        'Uncover comprehensive policy breakdowns on Policy Plunge. Explore in-depth stories analyzing the impact of policies on a local, national, and international scale.';
                    break;
                case 'spotlight':
                    metaData.metaTitle = 'Spotlight | The Secretariat News';
                    metaData.metaDescription =
                        "Stay informed with the most important policy headlines. Read an in-depth analysis of today's top stories.";
                    break;
                case 'from-the-corridors':
                    metaData.metaTitle = 'From the Corridors | The Secretariat News';
                    metaData.metaDescription =
                        'Dive deep into the bureaucracy with in-depth stories, profiles, transfers, and movement updates. Get the inside scoop on everything bureaucracy-related.';
                    break;
                case 'editorial-charter':
                    metaData.metaTitle = 'Editorial Charter | The Secretariat News';
                    metaData.metaDescription =
                        'Cut through the red tape! Our Editorial Charter guides our analytical & knowledge-based journalism on navigating bureaucracy and more.  Get informed & empowered!';
                    break;
                case 'news-wrap':
                    metaData.metaTitle = 'News Wrap | The Secretariat News';
                    metaData.metaDescription =
                        'Catch up on the latest headlines with our daily News Wrap. We curate top stories from a variety of trusted sources, so you can stay informed on what matters.';
                    break;
                case 'business-bottomline':
                    metaData.metaTitle = 'Business Bottomline | The Secretariat News';
                    metaData.metaDescription =
                        'Stay ahead of the curve with the latest business news, economic insights, and success strategies for entrepreneurs and corporations.';
                    break;
            }
            if (metaData.metaTitle) {
                this.seoService.updateMetaData(metaData);
                this.seoService.updateOpenGraph(metaData);
                this.seoService.updateTwitterOpenGraph(metaData);
            }
        }
        return metaData;
    }
}
