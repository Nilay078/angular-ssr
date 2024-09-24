import { Component, Input } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ApiUrl, AppUrlConstant } from 'src/app/constant/app-url';
import { getWindow } from 'ssr-window';
import { SnackBarService } from '../services/snackbar.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { SocialSharePlatform, socialSharePlatforms } from './social-share-platform';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-article-share',
    templateUrl: './article-share.component.html',
})
export class ArticleShareComponent {
    @Input() article!: any;
    @Input() hasButton = false;
    @Input() hasDisabled = false;

    apiUrl = ApiUrl;
    socialSharePlatforms: SocialSharePlatform[];

    constructor(private snackbarService: SnackBarService, private clipboard: Clipboard) {
        this.socialSharePlatforms = socialSharePlatforms;
    }

    socialMediaShare(article: any, shareUrl: string) {
        const baseUrl = environment.website + '/' + AppUrlConstant.ARTICLE_VIEW + '/' + article.slug;
        getWindow().open(`${shareUrl}${baseUrl}`, '_blank');
    }

    copyLink(article: any) {
        const baseUrl = environment.website + '/' + AppUrlConstant.ARTICLE_VIEW + '/' + article.slug;
        this.clipboard.copy(baseUrl);
        this.snackbarService.successSnackBar('Linked copied.');
    }
}
