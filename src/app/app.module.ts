import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard';
import { ErrorPageComponent } from './error-page/error-page.component';
import { PrivateComponent } from './private/private.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { HttpService } from './services/http.service';
import { SharedModule } from './shared/shared.module';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ExclusiveLoginComponent } from './public/exclusive-login/exclusive-login.component';
import { RegistrationComponent } from './public/registration/registration.component';
import { ArticleViewComponent } from './public/article-view/article-view.component';
import { VerificationComponent } from './public/verification/verification.component';
import { RegistrationUserDetailComponent } from './public/registration-user-detail/registration-user-detail.component';
import { CategoryComponent } from './public/category/category.component';
import { SubCategoryComponent } from './public/sub-category/sub-category.component';
import { MoreMenuComponent } from './public/more-menu/more-menu.component';
import { ContactComponent } from './public/contact/contact.component';
import { WriteForUsComponent } from './public/write-for-us/write-for-us.component';
import { CategoryTagWiseComponent } from './public/category-tag-wise/category-tag-wise.component';
import { FeedbackComponent } from './public/feedback/feedback.component';
import { CommonModule } from '@angular/common';
import { PrivateModule } from './private/private.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoginComponent } from './public/login/login.component';
import { SuccessWaitListComponent } from './public/success-wait-list/success-wait-list.component';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ArticleSearchComponent } from './public/article-search/article-search.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { StaticArticleComponent } from './public/static-article/static-article.component';
import { BannerComponent } from './public/common-sections/banner/banner.component';
import { ThumbnailComponent } from './public/common-sections/thumbnail/thumbnail.component';
import { SliderComponent } from './public/common-sections/slider/slider.component';
import { NewsletterComponent } from './public/common-sections/newsletter/newsletter.component';
import { WithoutImageComponent } from './public/common-sections/without-image/without-image.component';
import { WithoutImageNumberComponent } from './public/common-sections/without-image-number/without-image-number.component';
import { HeroBannerComponent } from './public/common-sections/hero-banner/hero-banner.component';
import { HeroBannerWithThumbnailComponent } from './public/common-sections/hero-banner-with-thumbnail/hero-banner-with-thumbnail.component';
import { HeroBannerBottomTextComponent } from './public/common-sections/hero-banner-bottom-text/hero-banner-bottom-text.component';
import { JoinWaitlistComponent } from './public/join-waitlist/join-waitlist.component';
import { PageConfigurationComponent } from './public/page-configuration/page-configuration.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { LocationSelectionComponent } from './public/location-selection/location-selection.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SliderStateSelectionComponent } from './public/common-sections/slider-state-selection/slider-state-selection.component';

@NgModule({
    declarations: [
        AppComponent,
        PrivateComponent,
        ErrorPageComponent,
        PublicLayoutComponent,
        ExclusiveLoginComponent,
        LoginComponent,
        JoinWaitlistComponent,
        RegistrationComponent,
        ArticleViewComponent,
        VerificationComponent,
        RegistrationUserDetailComponent,
        CategoryComponent,
        SubCategoryComponent,
        MoreMenuComponent,
        ContactComponent,
        WriteForUsComponent,
        CategoryTagWiseComponent,
        FeedbackComponent,
        SuccessWaitListComponent,
        ArticleSearchComponent,
        StaticArticleComponent,
        BannerComponent,
        ThumbnailComponent,
        SliderComponent,
        NewsletterComponent,
        WithoutImageComponent,
        WithoutImageNumberComponent,
        HeroBannerComponent,
        HeroBannerWithThumbnailComponent,
        HeroBannerBottomTextComponent,
        PageConfigurationComponent,
        LocationSelectionComponent,
        SliderStateSelectionComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        HttpClientModule,
        CommonModule,
        PrivateModule,
        FormsModule,
        ReactiveFormsModule,
        NgxUsefulSwiperModule,
        NgOtpInputModule,
        InfiniteScrollModule,
        NgxDocViewerModule,
        MatSelectFilterModule,
    ],
    providers: [
        HttpService,
        AuthGuard,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
        { provide: 'isBrowser', useValue: true },
        SsrCookieService,
        {
            provide: RouteReuseStrategy,
            useClass: CustomRouteReuseStrategy,
        },
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
