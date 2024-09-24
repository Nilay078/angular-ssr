import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { MenuComponent } from './components/menu/menu.component';
import { LineSkeletonLoaderComponent } from './components/circle-skeleton-loader/line-skeleton-loader.component';
import { CircleSkeletonLoaderComponent } from './components/circle-skeleton-loader/circle-skeleton-loader.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { NoRecordFoundComponent } from './components/no-record-found/no-record-found.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ArticleShareComponent } from './components/article-share/article-share.component';
import { SubscriberDetailsComponent } from './components/subscriber-details/subscriber-details.component';
import { MatSnackbarComponent } from './components/mat-snackbar/mat-snackbar.component';
import { NoSpecialCharactersDirective } from './components/header/no-special-characters-directive';
import { ArticleAuthorComponent } from './components/article-author/article-author.component';
import { ShareOnSocialPipe } from './pipes/share-on-social.pipe';

const COMPONENTS = [
    HeaderComponent,
    FooterComponent,
    SplashScreenComponent,
    MenuComponent,
    LineSkeletonLoaderComponent,
    CircleSkeletonLoaderComponent,
    LoaderComponent,
    ErrorMessageComponent,
    NoRecordFoundComponent,
    BreadcrumbComponent,
    ArticleShareComponent,
    SubscriberDetailsComponent,
    MatSnackbarComponent,
    NoSpecialCharactersDirective,
    ArticleAuthorComponent,
];

@NgModule({
    declarations: [...COMPONENTS, ShareOnSocialPipe],
    imports: [CommonModule, MaterialModule, RouterModule, FormsModule, ReactiveFormsModule, NgxSkeletonLoaderModule],
    exports: [...COMPONENTS, MaterialModule, ShareOnSocialPipe],
})
export class SharedModule {}
