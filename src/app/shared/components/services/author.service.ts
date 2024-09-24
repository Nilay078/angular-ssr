import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Url } from 'src/app/constant/app-url';
import Utils from 'src/app/utility/utils';
import { ArticleType } from '../../enums/article-type-enum';

@Injectable({
    providedIn: 'root',
})
export class AuthorService {
    articleType = ArticleType;
    public generateSlug(name: string, id: number, type: any): string {
        let slug;
        switch (type) {
            case this.articleType.AUTHOR: {
                slug = `${Url.ARTICLES_BY_AUTHOR}${Utils.convertToSlug(name)}-${id}`;
                break;
            }
            case this.articleType.TAG: {
                slug = `${Url.ARTICLES_BY_TAG}${Utils.convertToSlug(name)}-${id}`;
                break;
            }
            case this.articleType.CATEGORY: {
                slug = `${Url.ARTICLES_BY_CATEGORY}${Utils.convertToSlug(name)}-${id}`;
                break;
            }
            case this.articleType.STATE: {
                slug = `${Url.ARTICLES_BY_STATE}${Utils.convertToSlug(name)}-${id}`;
                break;
            }
            default: {
                slug = `${Utils.convertToSlug(name)}-${id}`;
                break;
            }
        }
        return slug;
    }

    public getIdFromSlug(slug: string): string | undefined {
        return _.last(_.split(slug, '-'));
    }
}
