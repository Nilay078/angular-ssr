import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { AuthorService } from '../services/author.service';
import { ArticleType } from '../../enums/article-type-enum';
import { Author } from 'src/app/public/article-view/article';
import { ApiUrl } from 'src/app/constant/app-url';
import { Router } from '@angular/router';

@Component({
    selector: 'app-article-author',
    templateUrl: './article-author.component.html',
})
export class ArticleAuthorComponent {
    @ViewChild('toggleButton') toggleButton!: ElementRef;
    @Input() authorViews!: Author[];
    @Input() hasImage!: boolean;
    @Input() hasClickable = true;
    articleType = ArticleType;
    isMoreAuthor = false;
    apiUrl = ApiUrl;

    constructor(public authorService: AuthorService, private router: Router, private renderer: Renderer2) {
        this.renderer.listen('window', 'click', e => {
            if (this.toggleButton && !this.toggleButton.nativeElement.contains(e.target)) {
                this.isMoreAuthor = false;
            }
        });
    }

    onClick() {
        this.isMoreAuthor = !this.isMoreAuthor;
    }

    onAuthorView(author: Author) {
        if (this.hasClickable) {
            this.router.navigate([this.authorService.generateSlug(author.displayName, author.id, this.articleType.AUTHOR)]);
        }
    }
}
