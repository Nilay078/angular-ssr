import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppUrlConstant } from '../constant/app-url';
import { MyAccountComponent } from './my-account/my-account.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditPreferencesComponent } from './edit-preferences/edit-preferences.component';
import { RecentViewComponent } from './recent-view/recent-view.component';
import { AuthGuard } from '../auth-guard';
import { NewsNewsletterAlertsComponent } from './news-newsletter-alerts/news-newsletter-alerts.component';

const routes: Routes = [
    { path: AppUrlConstant.MY_ACCOUNT, component: MyAccountComponent, canActivate: [AuthGuard] },
    { path: AppUrlConstant.BOOKMARKS, component: BookmarksComponent, canActivate: [AuthGuard] },
    { path: AppUrlConstant.EDIT_PROFILE, component: EditProfileComponent, canActivate: [AuthGuard] },
    { path: AppUrlConstant.EDIT_PREFERENCES, component: EditPreferencesComponent, canActivate: [AuthGuard] },
    { path: AppUrlConstant.NEWSLETTER_SUBSCRIPTION, component: NewsNewsletterAlertsComponent, canActivate: [AuthGuard] },
    { path: AppUrlConstant.RECENT_VIEW, component: RecentViewComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PrivateRouting {}
