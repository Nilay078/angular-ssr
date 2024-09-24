import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { AppUrlConstant } from './constant/app-url';
import { ErrorMessage } from './constant/error-message';
import { ErrorPageComponent } from './error-page/error-page.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PrivateComponent } from './private/private.component';
import { CategoryTagWiseComponent } from './public/category-tag-wise/category-tag-wise.component';
import { CategoryComponent } from './public/category/category.component';
import { ContactComponent } from './public/contact/contact.component';
import { FeedbackComponent } from './public/feedback/feedback.component';
import { ExclusiveLoginComponent } from './public/exclusive-login/exclusive-login.component';
import { MoreMenuComponent } from './public/more-menu/more-menu.component';
import { RegistrationUserDetailComponent } from './public/registration-user-detail/registration-user-detail.component';
import { RegistrationComponent } from './public/registration/registration.component';
import { SubCategoryComponent } from './public/sub-category/sub-category.component';
import { VerificationComponent } from './public/verification/verification.component';
import { WriteForUsComponent } from './public/write-for-us/write-for-us.component';
import { ArticleViewComponent } from './public/article-view/article-view.component';
import { LoginComponent } from './public/login/login.component';
import { SuccessWaitListComponent } from './public/success-wait-list/success-wait-list.component';
import { ArticleResolver } from './article-resolver';
import { ArticleSearchComponent } from './public/article-search/article-search.component';
import { JoinWaitlistComponent } from './public/join-waitlist/join-waitlist.component';
import { PageConfigurationComponent } from './public/page-configuration/page-configuration.component';
import { PageResolver } from './page-configuration-resolver';
import { CategoryTagWiseResolver } from './category-tag-wise-resolver';
import { LocationSelectionComponent } from './public/location-selection/location-selection.component';

const routes: Routes = [
    {
        path: AppUrlConstant.UNAUTHORIZED,
        component: ErrorPageComponent,
        data: {
            title: '403',
            shortDescription: ErrorMessage.unauthorized,
            longDescription: ErrorMessage[403],
        },
    },
    {
        path: AppUrlConstant.PAGE_NOT_FOUND,
        component: ErrorPageComponent,
        data: {
            title: '404',
            shortDescription: ErrorMessage.pageNotFound,
            longDescription: ErrorMessage[404],
        },
    },
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', redirectTo: ':slug', pathMatch: 'full' },
            { path: AppUrlConstant.EXCLUSIVE_LOGIN, component: ExclusiveLoginComponent },
            { path: AppUrlConstant.SUCCESS_WAIT_LIST, component: SuccessWaitListComponent },
            { path: AppUrlConstant.LOGIN, component: LoginComponent },
            { path: AppUrlConstant.JOIN_WAITLIST, component: JoinWaitlistComponent },
            { path: AppUrlConstant.REGISTRATION, component: RegistrationComponent },
            {
                path: AppUrlConstant.ARTICLE_VIEW + '/:id',
                component: ArticleViewComponent,
                data: {},
                resolve: { article: ArticleResolver },
            },
            { path: AppUrlConstant.ARTICLE_SEARCH, component: ArticleSearchComponent },
            { path: AppUrlConstant.ARTICLE_SEARCH + '/:**', component: ArticleSearchComponent },
            { path: AppUrlConstant.VERIFICATION, component: VerificationComponent, canActivate: [AuthGuard] },
            { path: AppUrlConstant.USER_REGISTRATION, component: RegistrationUserDetailComponent, canActivate: [AuthGuard] },
            { path: AppUrlConstant.CATEGORY, component: CategoryComponent, canActivate: [AuthGuard] },
            { path: AppUrlConstant.SUB_CATEGORY, component: SubCategoryComponent, canActivate: [AuthGuard] },
            { path: AppUrlConstant.MORE, component: MoreMenuComponent },
            { path: AppUrlConstant.CONTACT, component: ContactComponent },
            { path: AppUrlConstant.WRITE_FOR_US, component: WriteForUsComponent },
            { path: AppUrlConstant.FEEDBACK, component: FeedbackComponent },
            { path: AppUrlConstant.LOCATION_SELECTION, component: LocationSelectionComponent },
            {
                path: AppUrlConstant.ARTICLE_VIEW + '/:type' + '/:id',
                component: CategoryTagWiseComponent,
                data: { alwaysRefresh: true },
                resolve: { page: CategoryTagWiseResolver },
            },
            { path: ':slug', component: PageConfigurationComponent, data: {}, resolve: { page: PageResolver } },
        ],
    },
    {
        path: '',
        component: PrivateComponent,
        children: [
            { path: '', redirectTo: 'private', pathMatch: 'full' },
            {
                path: AppUrlConstant.PRIVATE,
                canActivate: [AuthGuard],
                loadChildren: () => import('src/app/private/private.module').then(m => m.PrivateModule),
            },
        ],
    },
    {
        path: '**',
        component: ErrorPageComponent,
        data: {
            title: '404',
            shortDescription: ErrorMessage.pageNotFound,
            longDescription: ErrorMessage[404],
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            initialNavigation: 'enabledBlocking',
            scrollPositionRestoration: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
