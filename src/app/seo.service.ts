import { environment } from 'src/environments/environment';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ApiUrl, Url } from './constant/app-url';
import { DOCUMENT, formatDate } from '@angular/common';
import { AuthorService } from './shared/components/services/author.service';
import { ArticleType } from './shared/enums/article-type-enum';
import Utils from './utility/utils';
import { Article, Author, SocialMediaView } from './public/article-view/article';
import * as _ from 'lodash';

export interface AuthorSchema {
    '@type'?: string;
    name?: string;
    url?: string;
    sameAs?: (string | undefined)[];
}

@Injectable({
    providedIn: 'root',
})
export class SEOService {
    appUrl = Url;
    articleEnumType = ArticleType;
    utils = Utils;
    apiUrl = ApiUrl;
    bannerImageUrl = '';

    constructor(
        private titleSvc: Title,
        private metaSvc: Meta,
        private authorService: AuthorService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    setArticleMetaData(article: Article) {
        this.bannerImageUrl = this.apiUrl.DOWNLOAD_IMAGE + article.bannerFileView.fileId;

        this.updateMetaData(article);
        this.updateOpenGraph(article);
        this.updateTwitterOpenGraph(article);

        const bodyElement = this.document.querySelector('body');
        if (bodyElement) {
            const node = this.document.createElement('script');
            node.innerHTML = JSON.stringify(this.generateNewsSchema(article));
            node.type = 'application/ld+json';
            bodyElement.appendChild(node);
        }
    }

    updateMetaData(article: Article): void {
        this.titleSvc.setTitle(article.title ?? article.metaTitle);
        this.metaSvc.updateTag({ name: 'title', content: article.metaTitle });
        this.metaSvc.updateTag({ name: 'description', content: article.metaDescription });
        this.metaSvc.updateTag({ name: 'keywords', content: article.metaKeyword ?? 'thesecretariat, secretariat, secretariat news' });
    }

    updateOpenGraph(article: Article): void {
        this.metaSvc.updateTag({ property: 'og:title', content: article.title ?? article.metaTitle });
        this.metaSvc.updateTag({
            property: 'og:url',
            content: article.slug
                ? `${environment.website}/${this.appUrl.ARTICLE_VIEW}/${article.slug}`
                : `${environment.website}/${article.url}`,
        });
        this.metaSvc.updateTag({ property: 'og:description', content: article.subHeading ?? article.metaDescription });
        if (this.bannerImageUrl) {
            this.metaSvc.updateTag({ property: 'og:image', content: this.bannerImageUrl });
        }
        if (article.authorView) {
            const authorNames = _.map(article.authorViews, (author: Author) => author.displayName).join(', ');
            this.metaSvc.addTag({ property: 'article:author', content: authorNames });
        }
    }

    updateTwitterOpenGraph(article: Article): void {
        this.metaSvc.updateTag({ property: 'twitter:title', content: article.title ?? article.metaTitle });
        this.metaSvc.updateTag({ property: 'twitter:description', content: article.subHeading ?? article.metaDescription });
        if (this.bannerImageUrl) {
            this.metaSvc.updateTag({ property: 'twitter:image', content: this.bannerImageUrl });
        }
        this.metaSvc.updateTag({
            property: 'twitter:app:url:googleplay',
            content: article.slug
                ? `${environment.website}/${this.appUrl.ARTICLE_VIEW}/${article.slug}`
                : `${environment.website}/${article.url}`,
        });
        this.metaSvc.updateTag({
            property: 'twitter:app:url:iphone',
            content: article.slug
                ? `${environment.website}/${this.appUrl.ARTICLE_VIEW}/${article.slug}`
                : `${environment.website}/${article.url}`,
        });
    }

    private generateNewsSchema(article: Article) {
        const authors: AuthorSchema[] = [];
        if (article.authorViews) {
            _.forEach(article.authorViews, (author: Author) => {
                const authorData: AuthorSchema = {};
                authorData['@type'] = 'Person';
                authorData.name = author.displayName;
                authorData.url = `${environment.website}/${this.authorService.generateSlug(
                    author.displayName,
                    author.id,
                    this.articleEnumType.AUTHOR
                )}`;
                if (author?.socialMediaViewList?.length) {
                    authorData.sameAs = _.map(
                        author.socialMediaViewList,
                        (socialMediaView: SocialMediaView) => socialMediaView.socialMediaLink
                    );
                }
                authors.push(authorData);
            });
        }
        return {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${environment.website}/${this.appUrl.ARTICLE_VIEW}/${article.slug}`,
            },
            headline: article.title ?? article.metaTitle,
            description: article.subHeading ?? article.metaDescription,
            image: `${ApiUrl.DOWNLOAD_IMAGE + article.thumbnailImageView.fileId}`,
            author: authors,
            publisher: {
                '@type': 'Organization',
                name: 'The Secretariat',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://thesecretariat.in/assets/images/thesecretariat-logo.svg',
                },
                sameAs: [
                    'https://m.facebook.com/secretariat.in/',
                    'https://twitter.com/secretariat_in/',
                    'https://www.instagram.com/secretariat.in/',
                    'https://www.linkedin.com/company/secretariat-in/',
                ],
            },
            datePublished: article.publishDate ? formatDate(this.utils.fromEpochToDate(article.publishDate), 'yyyy-MM-dd', 'en') : '',
            dateModified: article.updateDate ? formatDate(this.utils.fromEpochToDate(article.updateDate), 'yyyy-MM-dd', 'en') : '',
        };
    }

    setCanonicalLink(url: string) {
        const link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
        link.setAttribute('href', url);
    }
}
