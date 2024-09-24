import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRouting } from './private-routing';
import { SharedModule } from '../shared/shared.module';
import { MyAccountComponent } from './my-account/my-account.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { PrivateHeaderComponent } from './private-header/private-header.component';
import { FilterComponent } from './filter/filter.component';
import { MyAccountMenuComponent } from './my-account-menu/my-account-menu.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditPreferencesComponent } from './edit-preferences/edit-preferences.component';
import { RecentViewComponent } from './recent-view/recent-view.component';
import { NewsNewsletterAlertsComponent } from './news-newsletter-alerts/news-newsletter-alerts.component';
import { MatSelectFilterModule } from 'mat-select-filter';

const COMPONENTS = [
    MyAccountComponent,
    BookmarksComponent,
    PrivateHeaderComponent,
    FilterComponent,
    MyAccountMenuComponent,
    EditProfileComponent,
    EditPreferencesComponent,
    RecentViewComponent,
    NewsNewsletterAlertsComponent,
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [CommonModule, PrivateRouting, SharedModule, FormsModule, ReactiveFormsModule, MatSelectFilterModule],
    exports: [...COMPONENTS],
})
export class PrivateModule {}
